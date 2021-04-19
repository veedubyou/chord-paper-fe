import { Duration } from "luxon";
import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import FilePlayer from "react-player/file";
import { TimeSection } from "../../../common/ChordModel/ChordLine";
import { PlainFn } from "../../../common/PlainFn";
import { PlayerTimeContext } from "../../PlayerTimeContext";

export interface ButtonActionAndState {
    action: PlainFn;
    enabled: boolean;
}

export interface TimeControls {
    playing: boolean;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    goToBeginning: PlainFn;
    makeSkipBack: (
        currentSection: TimeSection | null,
        previousSection: TimeSection | null
    ) => ButtonActionAndState;
    makeSkipForward: (nextSection: TimeSection | null) => ButtonActionAndState;
    currentTime: number;
    currentTimeFormatted: string;
    onProgress: (state: {
        played: number;
        playedSeconds: number;
        loaded: number;
        loadedSeconds: number;
    }) => void;
    onPlay: PlainFn;
    onPause: PlainFn;
}

export const useTimeControls = (
    currentPlayerRef: ReactPlayer | FilePlayer | undefined
): TimeControls => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // a ref version so that a past render can access a future state
    // see outOfSyncWorkaround for the reason
    const currentTimeRef = useRef<number>(currentTime);
    currentTimeRef.current = currentTime;

    const jumpInterval = 5; // seconds

    const skipBackBuffer = 2; // seconds;
    const skipLeadIn = 1; // seconds;

    {
        const getPlayerTimeRef = useContext(PlayerTimeContext);
        const getCurrentTime = () => currentTimeRef.current;

        useEffect(() => {
            getPlayerTimeRef.current = getCurrentTime;
        });
    }

    const seekTo = (time: number) => {
        if (time < 0) {
            time = 0;
        }

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
            seekTo(currentTimeRef.current);
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

    const goToBeginningAction = () => {
        seekTo(0);
    };

    const makeSkipBackButton = (
        currentSection: TimeSection | null,
        previousSection: TimeSection | null
    ): ButtonActionAndState => {
        return {
            action: () => {
                if (currentSection === null) {
                    return;
                }

                if (
                    previousSection !== null &&
                    currentTime <= currentSection.time + skipBackBuffer
                ) {
                    seekTo(previousSection.time - skipLeadIn);
                    return;
                }

                seekTo(currentSection.time - skipLeadIn);
            },
            enabled: currentSection !== null,
        };
    };

    const makeSkipForwardButton = (
        nextSection: TimeSection | null
    ): ButtonActionAndState => {
        return {
            action: () => {
                if (nextSection !== null) {
                    seekTo(nextSection.time - skipLeadIn);
                }
            },
            enabled: nextSection !== null,
        };
    };

    const handleProgress = (state: {
        played: number;
        playedSeconds: number;
        loaded: number;
        loadedSeconds: number;
    }) => {
        setCurrentTime(state.playedSeconds);
    };

    const currentTimeFormatted: string = (() => {
        const duration: Duration = Duration.fromMillis(currentTime * 1000);
        return duration.toFormat("m:ss");
    })();

    return {
        playing: playing,
        play: playAction,
        pause: pauseAction,
        makeSkipBack: makeSkipBackButton,
        makeSkipForward: makeSkipForwardButton,
        jumpBack: jumpBackAction,
        jumpForward: jumpForwardAction,
        goToBeginning: goToBeginningAction,
        currentTime: currentTime,
        currentTimeFormatted: currentTimeFormatted,
        onProgress: handleProgress,
        onPlay: handlePlayState,
        onPause: handlePauseState,
    };
};
