import { Duration } from "luxon";
import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import FilePlayer from "react-player/file";
import { TimeSection } from "../../../common/ChordModel/ChordLine";
import { PlainFn, voidFn } from "../../../common/PlainFn";
import { PlayerTimeContext } from "../../PlayerTimeContext";

export interface ButtonActionAndState {
    action: PlainFn;
    enabled: boolean;
}

export interface PlayerControls {
    playerRef: React.MutableRefObject<ReactPlayer | FilePlayer | undefined>;
    playing: boolean;
    togglePlay: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    goToBeginning: PlainFn;
    skipBack: ButtonActionAndState;
    skipForward: ButtonActionAndState;
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
    currentSectionLabel: string;
    playratePercentage: number;
    onPlayratePercentageChange: (val: number) => void;
}

class NoopMutableRef {
    _current: ReactPlayer | FilePlayer | undefined;

    constructor() {
        this._current = undefined;
    }

    public set current(newCurrent: ReactPlayer | FilePlayer | undefined) {}

    public get current(): ReactPlayer | FilePlayer | undefined {
        return undefined;
    }
}

export const unfocusedControls: PlayerControls = {
    playerRef: new NoopMutableRef(),
    playing: false,
    togglePlay: voidFn,
    jumpBack: voidFn,
    jumpForward: voidFn,
    goToBeginning: voidFn,
    skipBack: {
        action: voidFn,
        enabled: false,
    },
    skipForward: {
        action: voidFn,
        enabled: false,
    },
    currentTime: 0,
    currentTimeFormatted: "0:00",
    onProgress: voidFn,
    onPlay: voidFn,
    onPause: voidFn,
    currentSectionLabel: "",
    playratePercentage: 100,
    onPlayratePercentageChange: voidFn,
};

export const usePlayerControls = (
    timeSections: TimeSection[]
): PlayerControls => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef<ReactPlayer | FilePlayer>();
    const [playratePercentage, setPlayratePercentage] = useState(100);

    // a ref version so that a past render can access a future state
    // see outOfSyncWorkaround for the reason
    const currentTimeRef = useRef<number>(currentTime);
    currentTimeRef.current = currentTime;

    const jumpInterval = 5; // seconds

    const skipBackBuffer = 2; // seconds;
    const skipForwardBuffer = 2; // seconds;

    // the amount to skip to before the section - helps not drop the user right on the down beat
    const skipLeadIn = 1; // seconds;

    {
        const getPlayerTimeRef = useContext(PlayerTimeContext);
        const getCurrentTime = () => currentTimeRef.current;

        useEffect(() => {
            getPlayerTimeRef.current = getCurrentTime;
        }, [getPlayerTimeRef, getCurrentTime]);
    }

    const seekTo = (time: number) => {
        if (time < 0) {
            time = 0;
        }

        playerRef.current?.seekTo(time, "seconds");
    };

    const handlePlayState = () => {
        setPlaying(true);
    };

    const handlePauseState = () => {
        setPlaying(false);
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
        setPlaying(false);
        outOfSyncWorkaround();
    };

    const playAction = () => {
        setPlaying(true);
    };

    const togglePlayAction = () => {
        if (playing) {
            pauseAction();
        } else {
            playAction();
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

    const currentSectionIndex = ((): number | null => {
        if (timeSections.length === 0) {
            return null;
        }

        let currentSectionIndex: number | null = null;

        timeSections.forEach((section: TimeSection, index: number) => {
            if (currentTime >= section.time) {
                if (
                    currentSectionIndex === null ||
                    section.time > timeSections[currentSectionIndex].time
                ) {
                    currentSectionIndex = index;
                }
            }
        });

        return currentSectionIndex;
    })();

    const currentSection: TimeSection | null =
        currentSectionIndex != null ? timeSections[currentSectionIndex] : null;

    const currentSectionLabel =
        currentSection !== null ? currentSection.name : "";

    const skipBackButton: ButtonActionAndState = {
        action: () => {
            if (currentSection === null) {
                return;
            }

            const previousSection: TimeSection | null = (() => {
                if (currentSectionIndex === null || currentSectionIndex === 0) {
                    return null;
                }

                return timeSections[currentSectionIndex - 1];
            })();

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

    const skipForwardButton: ButtonActionAndState = (() => {
        const findNextSectionIndex = (
            sectionIndex: number | null
        ): number | null => {
            if (timeSections.length === 0) {
                return null;
            }

            if (sectionIndex === null) {
                return 0;
            }

            if (sectionIndex === timeSections.length - 1) {
                return null;
            }

            return sectionIndex + 1;
        };

        const nextSectionIndex = findNextSectionIndex(currentSectionIndex);

        // determine what the actual next section is - it could be the next one or next next one depending on the buffer
        const nextSectionToSkipTo: TimeSection | null = (() => {
            if (nextSectionIndex === null) {
                return null;
            }

            const nextSection = timeSections[nextSectionIndex];

            // we could return section (n + 1) or section (n + 2)
            // the idea is that, e.g. the user is at 1:05 but the next section is at 1:06, and next next section is 1:30
            // then the user actually wants to go to 1:30 by skipping forward
            if (currentTime < nextSection.time - skipForwardBuffer) {
                return nextSection;
            }

            const nextNextSectionIndex = findNextSectionIndex(nextSectionIndex);
            if (nextNextSectionIndex === null) {
                return null;
            }

            return timeSections[nextNextSectionIndex];
        })();

        return {
            action: () => {
                if (nextSectionToSkipTo !== null) {
                    seekTo(nextSectionToSkipTo.time - skipLeadIn);
                }
            },
            enabled: nextSectionToSkipTo !== null,
        };
    })();

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
        playerRef: playerRef,
        playing: playing,
        togglePlay: togglePlayAction,
        skipBack: skipBackButton,
        skipForward: skipForwardButton,
        jumpBack: jumpBackAction,
        jumpForward: jumpForwardAction,
        goToBeginning: goToBeginningAction,
        currentTime: currentTime,
        currentTimeFormatted: currentTimeFormatted,
        onProgress: handleProgress,
        onPlay: handlePlayState,
        onPause: handlePauseState,
        currentSectionLabel: currentSectionLabel,
        playratePercentage: playratePercentage,
        onPlayratePercentageChange: setPlayratePercentage,
    };
};
