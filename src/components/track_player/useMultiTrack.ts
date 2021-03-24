import { Duration } from "luxon";
import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";
import { PlayerTimeContext } from "../PlayerTimeContext";
import { ensureGoogleDriveCacheBusted } from "./google_drive";

interface FullPlayerControl {
    trackControls: TrackControl[];
    currentSectionLabel: string;
    onCurrentTrackIndexChange: (newIndex: number) => void;
    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

export interface ButtonActionAndState {
    action: PlainFn;
    enabled: boolean;
}

export interface TrackControl extends Track {
    focused: boolean;
    playing: boolean;
    onPlay: PlainFn;
    onPause: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    goToBeginning: PlainFn;
    skipBack: ButtonActionAndState;
    skipForward: ButtonActionAndState;
    onProgress: (playedSeconds: number) => void;
    ref: React.Ref<ReactPlayer>;
}

interface CompactPlayerControl {
    playing: boolean;
    currentSectionLabel: string;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    skipBack: ButtonActionAndState;
    currentTime: string;
}

const voidFn = () => {};

const emptyButton: ButtonActionAndState = {
    action: voidFn,
    enabled: false,
};

export const useMultiTrack = (
    trackList: Track[],
    timeSections: TimeSection[]
): [FullPlayerControl, CompactPlayerControl] => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // a ref version so that a past render can access a future state
    // see outOfSyncWorkaround for the reason
    const currentTimeRef = useRef<number>(currentTime);
    currentTimeRef.current = currentTime;

    const [playrate, setPlayrate] = useState(100);

    // syntax bears a bit of explanation - the first use of useRef is just to keep state without rerender
    // (useState would rerender)
    // it's basically keeping a persistent array of refs around
    const playerRefs = useRef<React.RefObject<ReactPlayer>[]>([]);
    const cacheBusterID = useRef<string>(shortid.generate());

    const jumpInterval = 5; // seconds

    const skipBackBuffer = 2; // seconds;
    const skipLeadIn = 1; // seconds;

    const getPlayerTimeRef = useContext(PlayerTimeContext);
    const getCurrentTime = () => currentTimeRef.current;

    useEffect(() => {
        getPlayerTimeRef.current = getCurrentTime;
    });

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

    const [currentSection, previousSection, nextSection] = ((): [
        TimeSection | null,
        TimeSection | null,
        TimeSection | null
    ] => {
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

        const currentSection = (() => {
            if (currentSectionIndex === null) {
                return null;
            }
            return timeSections[currentSectionIndex];
        })();

        const previousSection = (() => {
            if (currentSectionIndex === null || currentSectionIndex === 0) {
                return null;
            }

            return timeSections[currentSectionIndex - 1];
        })();

        const nextSection = (() => {
            if (timeSections.length === 0) {
                return null;
            }

            if (currentSectionIndex === null) {
                return timeSections[0];
            }

            if (currentSectionIndex === timeSections.length - 1) {
                return null;
            }

            return timeSections[currentSectionIndex + 1];
        })();

        return [currentSection, previousSection, nextSection];
    })();

    const seekTo = (time: number) => {
        const currentPlayerRef: ReactPlayer | null =
            playerRefs.current[currentTrackIndex].current;

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

    const skipBackButton: ButtonActionAndState = {
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

    const skipForwardButton: ButtonActionAndState = {
        action: () => {
            if (nextSection !== null) {
                seekTo(nextSection.time - skipLeadIn);
            }
        },
        enabled: nextSection !== null,
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

            const thisIfFocused = <T>(thisThing: T, elseThing: T) => {
                if (focused) {
                    return thisThing;
                }

                return elseThing;
            };

            const fnIfFocused = <T extends PlainFn>(fn: T) =>
                thisIfFocused(fn, voidFn);

            return {
                label: track.label,
                url: processTrackURL(track.url),
                focused: focused,
                playing: focused && playing,
                onPlay: fnIfFocused(handlePlayState),
                onPause: fnIfFocused(handlePauseState),
                goToBeginning: fnIfFocused(goToBeginningAction),
                jumpBack: fnIfFocused(jumpBackAction),
                jumpForward: fnIfFocused(jumpForwardAction),
                skipBack: thisIfFocused(skipBackButton, emptyButton),
                skipForward: thisIfFocused(skipForwardButton, emptyButton),
                onProgress: thisIfFocused(handleProgress, voidFn),
                ref: playerRefs.current[index],
            };
        }
    );

    const currentSectionLabel =
        currentSection !== null ? currentSection.name : "";

    const fullPlayerControl: FullPlayerControl = {
        trackControls: trackControls,
        onCurrentTrackIndexChange: onCurrentTrackIndexChange,
        playrate: playrate,
        onPlayrateChange: setPlayrate,
        currentSectionLabel: currentSectionLabel,
    };

    const currentTimeFormatted: string = (() => {
        const duration: Duration = Duration.fromMillis(currentTime * 1000);
        return duration.toFormat("m:ss");
    })();

    const compactPlayerControl: CompactPlayerControl = {
        playing: playing,
        play: playAction,
        pause: pauseAction,
        skipBack: skipBackButton,
        jumpBack: jumpBackAction,
        currentTime: currentTimeFormatted,
        currentSectionLabel: currentSectionLabel,
    };

    return [fullPlayerControl, compactPlayerControl];
};
