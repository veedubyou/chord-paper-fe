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
    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

export interface TrackControl extends Track {
    focused: boolean;
    playing: boolean;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    skipBack: PlainFn;
    onProgress: (playedSeconds: number) => void;
    ref: React.Ref<ReactPlayer>;
}

interface CompactPlayerControl {
    playing: boolean;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    currentTime: string;
}

const voidFn = () => {};

export const useMultiTrack = (
    trackList: Track[]
): [FullPlayerControl, CompactPlayerControl] => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const [playrate, setPlayrate] = useState(100);

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

    const seekTo = (time: number) => {
        const currentPlayerRef: ReactPlayer | null =
            playerRefs.current[currentTrackIndex].current;
        currentPlayerRef?.seekTo(time, "seconds");
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleJumpBack = () => {
        let newTime = currentTime - jumpInterval;
        if (newTime < 0) {
            newTime = 0;
        }

        seekTo(newTime);
    };

    const handleJumpForward = () => {
        const newTime = currentTime + jumpInterval;
        seekTo(newTime);
    };

    const handleSkipBack = () => {
        seekTo(0);
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

            const fnIfFocused = <T>(fn: T) => {
                if (focused) {
                    return fn;
                }

                return voidFn;
            };

            return {
                label: track.label,
                url: processTrackURL(track.url),
                focused: focused,
                playing: focused && playing,
                play: fnIfFocused(handlePlay),
                pause: fnIfFocused(handlePause),
                jumpBack: fnIfFocused(handleJumpBack),
                jumpForward: fnIfFocused(handleJumpForward),
                skipBack: fnIfFocused(handleSkipBack),
                onProgress: fnIfFocused(handleProgress),
                ref: playerRefs.current[index],
            };
        }
    );

    const fullPlayerControl: FullPlayerControl = {
        trackControls: trackControls,
        onCurrentTrackIndexChange: onCurrentTrackIndexChange,
        playrate: playrate,
        onPlayrateChange: setPlayrate,
    };

    const currentTimeFormatted: string = (() => {
        const duration: Duration = Duration.fromMillis(currentTime * 1000);
        return duration.toFormat("m:ss");
    })();

    const compactPlayerControl: CompactPlayerControl = {
        playing: playing,
        play: handlePlay,
        pause: handlePause,
        jumpBack: handleJumpBack,
        currentTime: currentTimeFormatted,
    };

    return [fullPlayerControl, compactPlayerControl];
};
