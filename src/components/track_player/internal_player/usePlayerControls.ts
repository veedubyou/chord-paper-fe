import { TimestampedSection } from "common/ChordModel/ChordLine";
import { noopFn, PlainFn } from "common/PlainFn";
import { PlayerSectionContext } from "components/PlayerSectionContext";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import { ABLoop } from "components/track_player/internal_player/ABLoop";
import { List } from "immutable";
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import ReactPlayer from "react-player";
import FilePlayer from "react-player/file";
import YouTubePlayer from "react-player/youtube";

export interface ButtonActionAndState {
    action: PlainFn;
    enabled: boolean;
}

export interface ABLoopControl {
    abLoop: ABLoop;
    onChange: (newABLoop: ABLoop) => void;
}

export interface TempoControl {
    percentage: number;
    onChange: (val: number) => void;
}

export interface TransportActions {
    togglePlay: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    goToBeginning: PlainFn;
    skipBack: ButtonActionAndState;
    skipForward: ButtonActionAndState;
}

export interface PlayerControls {
    playerRef: React.MutableRefObject<ReactPlayer | FilePlayer | undefined>;
    playing: boolean;
    transport: TransportActions;
    getCurrentTime: () => number;
    onProgress: (state: {
        played: number;
        playedSeconds: number;
        loaded: number;
        loadedSeconds: number;
    }) => void;
    onPlay: PlainFn;
    onPause: PlainFn;
    tempo: TempoControl;
    abLoop: ABLoopControl;
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
    transport: {
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
    },
    getCurrentTime: () => 0,
    onProgress: noopFn,
    onPlay: noopFn,
    onPause: noopFn,
    tempo: {
        percentage: 100,
        onChange: noopFn,
    },
    abLoop: {
        abLoop: ABLoop.empty(),
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
    const currentTimeRef = useRef<number>(0);
    const [abLoop, setABLoop] = useState<ABLoop>(ABLoop.empty());
    const playerRef = useRef<ReactPlayer | FilePlayer>();
    const [tempoPercentage, setTempoPercentage] = useState(100);
    const currentSectionItem = useContext(PlayerSectionContext);

    const jumpInterval = 5; // seconds

    const skipBackBuffer = 2; // seconds;
    const skipForwardBuffer = 2; // seconds;

    // the amount to skip to before the section - helps not drop the user right on the down beat
    const skipLeadIn = 1; // seconds;

    const getCurrentTime = useCallback(() => currentTimeRef.current, []);

    {
        const getPlayerTimeRef = useContext(PlayerTimeContext);

        useEffect(() => {
            getPlayerTimeRef.current = getCurrentTime;
        }, [getPlayerTimeRef, getCurrentTime]);
    }

    const seekTo = useCallback((time: number) => {
        if (time < 0) {
            time = 0;
        }

        playerRef.current?.seekTo(time, "seconds");
    }, []);

    const handlePlayState = useCallback(() => {
        setPlaying(true);
    }, [setPlaying]);

    const handlePauseState = useCallback(() => {
        setPlaying(false);
    }, [setPlaying]);

    const outOfSyncWorkaround = useCallback(
        (nextSeekTime?: number) => {
            const currentURL = playerRef.current?.props.url;
            const applyWorkaround =
                typeof currentURL === "string" &&
                YouTubePlayer.canPlay(currentURL);

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
        },
        [seekTo]
    );

    const pauseAction = useCallback(
        (nextSeekTime?: number) => {
            setPlaying(false);
            outOfSyncWorkaround(nextSeekTime);
        },
        [setPlaying, outOfSyncWorkaround]
    );

    const playAction = useCallback(() => {
        setPlaying(true);
    }, [setPlaying]);

    const togglePlayAction = useCallback(() => {
        if (playing) {
            pauseAction();
        } else {
            playAction();
        }
    }, [playAction, pauseAction, playing]);

    const jumpBackAction = useCallback(() => {
        let newTime = currentTimeRef.current - jumpInterval;
        if (newTime < 0) {
            newTime = 0;
        }

        seekTo(newTime);
    }, [seekTo]);

    const jumpForwardAction = useCallback(() => {
        const newTime = currentTimeRef.current + jumpInterval;
        seekTo(newTime);
    }, [seekTo]);

    const goToBeginningAction = useCallback(() => {
        seekTo(0);
    }, [seekTo]);

    const skipBackButtonAction = useCallback(() => {
        if (currentSectionItem === null) {
            return;
        }

        const previousSection: TimestampedSection | null = (() => {
            if (currentSectionItem === null || currentSectionItem.index === 0) {
                return null;
            }

            return getSection(
                timestampedSections,
                currentSectionItem.index - 1
            );
        })();

        if (
            previousSection !== null &&
            currentTimeRef.current <=
                currentSectionItem.timestampedSection.time + skipBackBuffer
        ) {
            seekTo(previousSection.time - skipLeadIn);
            return;
        }

        seekTo(currentSectionItem.timestampedSection.time - skipLeadIn);
    }, [currentSectionItem, seekTo, timestampedSections]);

    const skipBackButton: ButtonActionAndState = useMemo(
        () => ({
            action: skipBackButtonAction,
            enabled: currentSectionItem !== null,
        }),
        [skipBackButtonAction, currentSectionItem]
    );

    const skipForwardButton: ButtonActionAndState = useMemo(() => {
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
            currentSectionItem !== null ? currentSectionItem.index : null;
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
            if (currentTimeRef.current < nextSection.time - skipForwardBuffer) {
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
    }, [currentSectionItem, seekTo, timestampedSections]);

    const handleABLoop = useCallback(
        (playedSeconds: number) => {
            if (abLoop.mode === "disabled") {
                return;
            }

            if (!abLoop.isSet()) {
                return;
            }

            if (!abLoop.isPlayable()) {
                return;
            }

            if (!abLoop.isOutsideLoop(playedSeconds)) {
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
        },
        [abLoop, pauseAction, seekTo]
    );

    const tempoControl = useMemo(
        () => ({
            percentage: tempoPercentage,
            onChange: setTempoPercentage,
        }),
        [tempoPercentage, setTempoPercentage]
    );

    const abLoopControl = useMemo(
        () => ({
            abLoop: abLoop,
            onChange: setABLoop,
        }),
        [abLoop, setABLoop]
    );

    const handleProgress = useCallback(
        (state: {
            played: number;
            playedSeconds: number;
            loaded: number;
            loadedSeconds: number;
        }) => {
            currentTimeRef.current = state.playedSeconds;
            handleABLoop(state.playedSeconds);
        },
        [handleABLoop]
    );

    const transportActions: TransportActions = useMemo(
        () => ({
            togglePlay: togglePlayAction,
            skipBack: skipBackButton,
            skipForward: skipForwardButton,
            jumpBack: jumpBackAction,
            jumpForward: jumpForwardAction,
            goToBeginning: goToBeginningAction,
        }),
        [
            togglePlayAction,
            skipBackButton,
            skipForwardButton,
            jumpBackAction,
            jumpForwardAction,
            goToBeginningAction,
        ]
    );

    const playerControls: PlayerControls = useMemo(
        () => ({
            playerRef: playerRef,
            playing: playing,
            getCurrentTime: getCurrentTime,
            onProgress: handleProgress,
            onPlay: handlePlayState,
            onPause: handlePauseState,
            transport: transportActions,
            tempo: tempoControl,
            abLoop: abLoopControl,
        }),
        [
            playing,
            getCurrentTime,
            handleProgress,
            handlePlayState,
            handlePauseState,
            transportActions,
            tempoControl,
            abLoopControl,
        ]
    );

    return playerControls;
};
