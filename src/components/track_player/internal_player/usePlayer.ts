import React, { useState } from "react";
import ReactPlayer from "react-player";
import { TimeSection } from "../../../common/ChordModel/ChordLine";
import { Track, TrackList } from "../../../common/ChordModel/Track";
import { PlainFn } from "../../../common/PlainFn";
import {
    FourStemTrackControl,
    useFourStemTrackControl,
} from "./useFourStemTrackControl";
import { useSections } from "./useSections";
import {
    SingleTrackControl,
    useSingleTrackControl,
} from "./useSingleTrackControl";
import { TimeControls, useTimeControls } from "./useTimeControls";
import { useMultiTrack } from "./useTrackManagement";

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

export interface BaseTrackControl {
    label: string;
    focused: boolean;
    playing: boolean;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    goToBeginning: PlainFn;
    skipBack: ButtonActionAndState;
    skipForward: ButtonActionAndState;
    onPlay: PlainFn;
    onPause: PlainFn;
    onProgress: (playedSeconds: number) => void;
    ref: React.Ref<ReactPlayer>;
}

export type TrackControl = BaseTrackControl &
    (SingleTrackControl | FourStemTrackControl);

interface CompactPlayerControl {
    playing: boolean;
    currentSectionLabel: string;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    skipBack: ButtonActionAndState;
    skipForward: ButtonActionAndState;
    currentTimeFormatted: string;
}

const voidFn = () => {};

const emptyButton: ButtonActionAndState = {
    action: voidFn,
    enabled: false,
};

export const usePlayer = (
    trackList: TrackList,
    timeSections: TimeSection[]
): [FullPlayerControl, CompactPlayerControl] => {
    const multiTrackState = useMultiTrack(trackList);
    const [playrate, setPlayrate] = useState(100);

    const makeSingleTrackControl = useSingleTrackControl();
    const makeFourStemTrackControl = useFourStemTrackControl();

    const timeControl: TimeControls = useTimeControls(
        multiTrackState.currentPlayerRef
    );

    const [currentSection, previousSection, nextSection] = useSections(
        timeSections,
        timeControl.currentTime
    );

    const synchronizeAllTracks = () => {
        for (let playerRef of multiTrackState.playerRefs.current) {
            playerRef.current?.seekTo(timeControl.currentTime, "seconds");
        }
    };

    const onCurrentTrackIndexChange = (newIndex: number) => {
        if (newIndex === multiTrackState.currentTrackIndex) {
            return;
        }

        synchronizeAllTracks();
        multiTrackState.setCurrentTrackIndex(newIndex);
    };

    const skipBack = timeControl.makeSkipBack(currentSection, previousSection);
    const skipForward = timeControl.makeSkipForward(nextSection);

    const trackControls: TrackControl[] = trackList.tracks.map(
        (track: Track, index: number): TrackControl => {
            const focused = index === multiTrackState.currentTrackIndex;

            const thisIfFocused = <T>(thisThing: T, elseThing: T) => {
                if (focused) {
                    return thisThing;
                }

                return elseThing;
            };

            const fnIfFocused = <T extends PlainFn>(fn: T) =>
                thisIfFocused(fn, voidFn);

            const specificTrackControl = (() => {
                switch (track.track_type) {
                    case "single": {
                        return makeSingleTrackControl(track);
                    }

                    case "4stems": {
                        return makeFourStemTrackControl(track);
                    }
                }
            })();

            return {
                ...specificTrackControl,
                label: track.label,
                focused: focused,
                playing: focused && timeControl.playing,
                play: fnIfFocused(timeControl.play),
                pause: fnIfFocused(timeControl.pause),
                goToBeginning: fnIfFocused(timeControl.goToBeginning),
                jumpBack: fnIfFocused(timeControl.jumpBack),
                jumpForward: fnIfFocused(timeControl.jumpForward),
                skipBack: thisIfFocused(skipBack, emptyButton),
                skipForward: thisIfFocused(skipForward, emptyButton),
                onPlay: fnIfFocused(timeControl.onPlay),
                onPause: fnIfFocused(timeControl.onPause),
                onProgress: thisIfFocused(timeControl.onProgress, voidFn),
                ref: multiTrackState.playerRefs.current[index],
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

    const compactPlayerControl: CompactPlayerControl = {
        playing: timeControl.playing,
        play: timeControl.play,
        pause: timeControl.pause,
        skipBack: skipBack,
        skipForward: skipForward,
        jumpBack: timeControl.jumpBack,
        jumpForward: timeControl.jumpForward,
        currentTimeFormatted: timeControl.currentTimeFormatted,
        currentSectionLabel: currentSectionLabel,
    };

    return [fullPlayerControl, compactPlayerControl];
};
