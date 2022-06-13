import { TimestampedSection } from "common/ChordModel/ChordLine";
import {
    findSectionAtTime
} from "common/ChordModel/Section";
import { noopFn, PlainFn } from "common/PlainFn";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import {
    ABLoop,
    isABLoopSet,
    isPlayableABLoop
} from "components/track_player/internal_player/ABLoop";
import { List } from "immutable";
import { Duration } from "luxon";
import { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import FilePlayer from "react-player/file";
import YouTubePlayer from "react-player/youtube";

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
    tempo: {
        percentage: number;
        onChange: (val: number) => void;
    };
    abLoop: {
        abLoop: ABLoop;
        onChange: (newABLoop: ABLoop) => void;
    };
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
    togglePlay: noopFn,
    jumpBack: noopFn,
    jumpForward: noopFn,
    goToBeginning: noopFn,
    skipBack: {
        action: noopFn,
        enabled: false,
    },
    skipForward: {
        action: noopFn,
        enabled: false,
    },
    currentTime: 0,
    currentTimeFormatted: "0:00",
    onProgress: noopFn,
    onPlay: noopFn,
    onPause: noopFn,
    tempo: {
        percentage: 100,
        onChange: noopFn,
    },
    abLoop: {
        abLoop: {
            timeA: null,
            timeB: null,
            mode: "disabled",
        },
        onChange: noopFn,
    },
};

const getSection = (
    timestampedSections: List<TimestampedSection>,
    index: number
): TimestampedSection => {
    const section = timestampedSections.get(index);
    if (section === undefined) {
        throw new Error("Section index is out of range, unexpected");
    }

    return section;
};

export const usePlayerControls = (
    timestampedSections: List<TimestampedSection>
): PlayerControls => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [abLoop, setABLoop] = useState<ABLoop>({
        timeA: null,
        timeB: null,
        mode: "disabled",
    });
    const playerRef = useRef<ReactPlayer | FilePlayer>();
    const [tempoPercentage, setTempoPercentage] = useState(100);

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

    const outOfSyncWorkaround = (nextSeekTime?: number) => {
        const currentURL = playerRef.current?.props.url;
        const applyWorkaround =
            typeof currentURL === "string" && YouTubePlayer.canPlay(currentURL);

        if (applyWorkaround) {
            // this is pretty unpleasant, but on certain videos, React Player can run into a race condition where
            // it doesn't respond to playing=true/false, so the play and pause button doesn't actually affect the track
            // this can be repro'd inconsistently by quickly toggling play/pause several times, or jump back, then pause in the compact player
            //
            // attempt at throttling didn't work, the wonkiness can occur even at 5 seconds of throttling depending on the course of events
            // one observation is that this wonky state can be reset out of by performing a seek after it gets into this state
            // however, it can't be too soon, hence the set timeout
            // and also we would want to seek to the time of the most updated time, not the one during the current render, hence the use of ref
            setTimeout(() => {
                const seekTime = nextSeekTime ?? currentTimeRef.current;
                seekTo(seekTime);
            }, 200);
        }
    };

    const pauseAction = (nextSeekTime?: number) => {
        setPlaying(false);
        outOfSyncWorkaround(nextSeekTime);
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

    const currentSection = findSectionAtTime(
        timestampedSections,
        currentTime
    );

    const skipBackButton: ButtonActionAndState = {
        action: () => {
            if (currentSection === null) {
                return;
            }

            const previousSection: TimestampedSection | null = (() => {
                if (currentSection === null || currentSection.index === 0) {
                    return null;
                }

                return getSection(
                    timestampedSections,
                    currentSection.index - 1
                );
            })();

            if (
                previousSection !== null &&
                currentTime <=
                    currentSection.timestampedSection.time + skipBackBuffer
            ) {
                seekTo(previousSection.time - skipLeadIn);
                return;
            }

            seekTo(currentSection.timestampedSection.time - skipLeadIn);
        },
        enabled: currentSection !== null,
    };

    const skipForwardButton: ButtonActionAndState = (() => {
        const findNextSectionIndex = (
            sectionIndex: number | null
        ): number | null => {
            if (timestampedSections.size === 0) {
                return null;
            }

            if (sectionIndex === null) {
                return 0;
            }

            if (sectionIndex === timestampedSections.size - 1) {
                return null;
            }

            return sectionIndex + 1;
        };

        const currentSectionIndex =
            currentSection !== null ? currentSection.index : null;
        const nextSectionIndex = findNextSectionIndex(currentSectionIndex);

        // determine what the actual next section is - it could be the next one or next next one depending on the buffer
        const nextSectionToSkipTo: TimestampedSection | null = (() => {
            if (nextSectionIndex === null) {
                return null;
            }

            const nextSection = getSection(
                timestampedSections,
                nextSectionIndex
            );

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

            return getSection(timestampedSections, nextNextSectionIndex);
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

    const handleABLoop = (playedSeconds: number) => {
        if (abLoop.mode === "disabled") {
            return;
        }

        if (!isABLoopSet(abLoop)) {
            return;
        }

        if (!isPlayableABLoop(abLoop)) {
            return;
        }

        const isOutsideABLoop =
            playedSeconds < abLoop.timeA || playedSeconds >= abLoop.timeB;

        if (!isOutsideABLoop) {
            return;
        }

        switch (abLoop.mode) {
            case "loop": {
                seekTo(abLoop.timeA);
                return;
            }

            case "rewind": {
                seekTo(abLoop.timeA);
                pauseAction(abLoop.timeA);
                return;
            }
        }
    };

    const handleProgress = (state: {
        played: number;
        playedSeconds: number;
        loaded: number;
        loadedSeconds: number;
    }) => {
        setCurrentTime(state.playedSeconds);
        handleABLoop(state.playedSeconds);
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
        tempo: {
            percentage: tempoPercentage,
            onChange: setTempoPercentage,
        },
        abLoop: {
            abLoop: abLoop,
            onChange: setABLoop,
        },
    };
};
