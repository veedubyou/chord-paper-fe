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
    onPlay: PlainFn;
    onPause: PlainFn;
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

    // a ref version so that a past render can access a future state
    // see outOfSyncWorkaround for the reason
    const currentTimeRefForWorkAround = useRef<number>(currentTime);
    currentTimeRefForWorkAround.current = currentTime;

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

    const handlePlayState = () => {
        setPlaying(true);
    };

    const handlePauseState = () => {
        setPlaying(false);
    };

    const playAction = () => {
        if (!playing) {
            setPlaying(true);
        }
    };

    const outOfSyncWorkaround = () => {
        // this is pretty unpleasant, but on certain videos, React Player can run into a race condition where
        // it doesn't respond to playing=true/false, so the play and pause button doesn't actually affect the track
        // this can be repro'd inconsistently by quickly toggling play/pause several times, or jump back, then pause in the compact player
        //
        // attempt at throttling didn't work, the wonkiness can occur even at 5 seconds of throttling depending on the course of events
        // one observation is that this wonky state can be reset out of by performing a seek after it gets into this state
        // however, it can't be too soon, hence the set timeout
        // and also we would want to seek to the time of the most updated time, not the one during the current render, hence the use of ref
        setTimeout(() => {
            seekTo(currentTimeRefForWorkAround.current);
        }, 200);
    };

    const pauseAction = () => {
        if (playing) {
            setPlaying(false);
            outOfSyncWorkaround();
        }
    };

    const jumpBackAction = () => {
        let newTime = currentTime - jumpInterval;
        if (newTime < 0) {
            newTime = 0;
        }

        seekTo(newTime);
    };

    const jumpForwardAction = () => {
        const newTime = currentTime + jumpInterval;
        seekTo(newTime);
    };

    const skipBackAction = () => {
        seekTo(0);
    };

    const handleProgress = (playedSeconds: number) => {
        setCurrentTime(playedSeconds);
    };

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
                onPlay: fnIfFocused(handlePlayState),
                onPause: fnIfFocused(handlePauseState),
                jumpBack: fnIfFocused(jumpBackAction),
                jumpForward: fnIfFocused(jumpForwardAction),
                skipBack: fnIfFocused(skipBackAction),
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
        play: playAction,
        pause: pauseAction,
        jumpBack: jumpBackAction,
        currentTime: currentTimeFormatted,
    };

    return [fullPlayerControl, compactPlayerControl];
};
