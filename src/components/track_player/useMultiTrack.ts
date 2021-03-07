import ReactPlayer from "react-player";
import { Track } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";
import React, { useRef, useState } from "react";
import shortid from "shortid";
import { ensureGoogleDriveCacheBusted } from "./google_drive";
import { Duration } from "luxon";

interface FullPlayerControl {
    trackControls: TrackControl[];
    onCurrentTrackIndexChange: (newIndex: number) => void;
}

export interface TrackControl extends Track {
    focused: boolean;
    playing: boolean;
    onPlay: PlainFn;
    onPause: PlainFn;
    onProgress: (playedSeconds: number) => void;
    ref: React.Ref<ReactPlayer>;
}

interface CompactPlayerControl {
    playing: boolean;
    onPlay: PlainFn;
    onPause: PlainFn;
    onJumpBack: PlainFn;
    currentTime: string;
}

const voidFn = () => {};

export const useMultiTrack = (
    trackList: Track[]
): [FullPlayerControl, CompactPlayerControl] => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    // syntax bears a bit of explanation - the first use of useRef is just to keep state without rerender
    // (useState would rerender)
    // it's basically keeping a persistent array of refs around
    const playerRefs = useRef<React.RefObject<ReactPlayer>[]>([]);
    const cacheBusterID = useRef<string>(shortid.generate());

    const jumpInterval = 5; // seconds

    const processTrackURL = (url: string): string => {
        // Firefox caches some redirects on Google Drive links, which eventually leads
        // to 403 on subsequent reloads. Breaking the cache here so that the loading doesn't break
        return ensureGoogleDriveCacheBusted(url, cacheBusterID.current);
    };

    const adjustRefArraySize = () => {
        if (trackList.length > playerRefs.current.length) {
            const diff: number = trackList.length - playerRefs.current.length;
            for (let i = 0; i < diff; i++) {
                playerRefs.current.push(React.createRef<ReactPlayer>());
            }
        } else if (trackList.length < playerRefs.current.length) {
            playerRefs.current.splice(trackList.length);
        }
    };

    adjustRefArraySize();

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleJumpBack = () => {
        let newTime = currentTime - jumpInterval;
        if (newTime < 0) {
            newTime = 0;
        }

        const currentPlayerRef: ReactPlayer | null =
            playerRefs.current[currentTrackIndex].current;
        currentPlayerRef?.seekTo(newTime, "seconds");
    };

    const handleProgress = (playedSeconds: number) =>
        setCurrentTime(playedSeconds);

    const synchronizeAllTracks = () => {
        for (let playerRef of playerRefs.current) {
            playerRef.current?.seekTo(currentTime, "seconds");
        }
    };

    const onCurrentTrackIndexChange = (newIndex: number) => {
        if (newIndex === currentTrackIndex) {
            return;
        }

        synchronizeAllTracks();
        setCurrentTrackIndex(newIndex);
    };

    const trackControls: TrackControl[] = trackList.map(
        (track: Track, index: number) => {
            const focused = index === currentTrackIndex;

            return {
                label: track.label,
                url: processTrackURL(track.url),
                focused: focused,
                playing: focused && playing,
                onPlay: focused ? handlePlay : voidFn,
                onPause: focused ? handlePause : voidFn,
                onProgress: focused ? handleProgress : voidFn,
                ref: playerRefs.current[index],
            };
        }
    );

    const fullPlayerControl: FullPlayerControl = {
        trackControls: trackControls,
        onCurrentTrackIndexChange: onCurrentTrackIndexChange,
    };

    const currentTimeFormatted: string = (() => {
        const duration: Duration = Duration.fromMillis(currentTime * 1000);
        return duration.toFormat("m:ss");
    })();

    const compactPlayerControl: CompactPlayerControl = {
        playing: playing,
        onPlay: handlePlay,
        onPause: handlePause,
        onJumpBack: handleJumpBack,
        currentTime: currentTimeFormatted,
    };

    return [fullPlayerControl, compactPlayerControl];
};
