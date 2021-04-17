import { Box } from "@material-ui/core";
import audioBufferToWav from "audiobuffer-to-wav";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import * as Tone from "tone";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import {
    FourStemEmptyObject,
    FourStemKeys,
} from "../../../../common/ChordModel/Track";
import { mapObject } from "../../../../common/mapObject";
import ControlPane from "../ControlPane";
import { useSections } from "../useSections";
import { ButtonActionAndState, useTimeControls } from "../useTimeControls";
import { audioCtx } from "./audioCtx";
import FourStemControlPane, {
    ButtonStateAndAction,
} from "./FourStemControlPane";
import lodash from "lodash";

interface StemToneNodes {
    player: Tone.GrainPlayer;
    volume: Tone.Volume;
    endNode: Tone.Volume;
}

interface ButtonState {
    muted: boolean;
}

type ToneNodes = Record<FourStemKeys, StemToneNodes>;
type ButtonStates = Record<FourStemKeys, ButtonState>;

interface LoadedFourStemTrackPlayerProps {
    audioBuffers: Record<FourStemKeys, AudioBuffer>;
    readonly timeSections: TimeSection[];
    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

const createToneNodes = (audioBuffer: AudioBuffer): StemToneNodes => {
    const volume = new Tone.Volume();
    const player = new Tone.GrainPlayer({ url: audioBuffer }).connect(volume);

    return {
        volume: volume,
        player: player,
        endNode: volume,
    };
};

const createEmptySongURL = (time: number): string => {
    const audioBuffer = audioCtx.createBuffer(
        2,
        audioCtx.sampleRate * time,
        audioCtx.sampleRate
    );

    const arrayBuffer = audioBufferToWav(audioBuffer);
    const blob = new window.Blob([arrayBuffer]);
    const songURL = URL.createObjectURL(blob);
    return songURL;
};

const LoadedFourStemTrackPlayer: React.FC<LoadedFourStemTrackPlayerProps> = (
    props: LoadedFourStemTrackPlayerProps
): JSX.Element => {
    const playerRef = useRef<ReactPlayer>();
    const timeControl = useTimeControls(playerRef.current);

    const [
        currentSectionLabel,
        currentSection,
        previousSection,
        nextSection,
    ] = useSections(props.timeSections, timeControl.currentTime);

    const toneNodes: ToneNodes = useMemo(
        () => mapObject(props.audioBuffers, createToneNodes),
        [props.audioBuffers]
    );

    const [buttonStates, setButtonStates] = useState<ButtonStates>(
        mapObject(FourStemEmptyObject, () => ({
            muted: false,
        }))
    );

    const silentURL = useMemo(
        () => createEmptySongURL(props.audioBuffers.bass.duration),
        [props.audioBuffers.bass.duration]
    );

    const commonReactPlayerProps: ReactPlayerProps = {
        ref: playerRef,
        playing: timeControl.playing,
        controls: true,
        playbackRate: 1, //TODO
        onPlay: timeControl.onPlay,
        onPause: timeControl.onPause,
        onProgress: timeControl.onProgress,
        progressInterval: 500,
        style: { minWidth: "50vw" },
        height: "auto",
        config: { file: { forceAudio: true } },
    };

    const playButton: ButtonActionAndState = {
        action: timeControl.play,
        enabled: true,
    };

    const skipBack = timeControl.makeSkipBack(currentSection, previousSection);
    const skipForward = timeControl.makeSkipForward(nextSection);

    const syncToneTransport = () => {
        // sync the play state
        if (timeControl.playing && Tone.Transport.state !== "started") {
            Tone.Transport.start();
        } else if (
            !timeControl.playing &&
            Tone.Transport.state !== "paused" &&
            Tone.Transport.state !== "stopped"
        ) {
            Tone.Transport.pause();
        }

        // sync the time
        if (Math.abs(timeControl.currentTime - Tone.Transport.seconds) > 1) {
            Tone.Transport.seconds = timeControl.currentTime;
        }

        let stemKey: FourStemKeys;
        for (stemKey in buttonStates) {
            toneNodes[stemKey].endNode.mute = buttonStates[stemKey].muted;
        }
    };

    useEffect(() => {
        let stemKey: FourStemKeys;
        for (stemKey in toneNodes) {
            toneNodes[stemKey].player.sync().start(0);
            toneNodes[stemKey].volume.toDestination();
        }

        return () => {
            let stemKey: FourStemKeys;
            for (stemKey in toneNodes) {
                toneNodes[stemKey].volume.dispose();
                toneNodes[stemKey].player.unsync();
                toneNodes[stemKey].player.dispose();
            }
        };
    }, [toneNodes]);

    syncToneTransport();

    const stemControlPane = (() => {
        const makeButtonStateAndAction = (
            stemState: StemToneNodes,
            stemKey: FourStemKeys
        ): ButtonStateAndAction => {
            return {
                enabled: !stemState.endNode.mute,
                onToggle: (enabled: boolean) => {
                    const newButtonStates = lodash.cloneDeep(buttonStates);
                    newButtonStates[stemKey].muted = !enabled;
                    setButtonStates(newButtonStates);
                },
            };
        };

        const buttonStateAndActions = mapObject(
            toneNodes,
            makeButtonStateAndAction
        );

        return <FourStemControlPane {...buttonStateAndActions} />;
    })();

    return (
        <Box>
            <Box>
                <ReactPlayer {...commonReactPlayerProps} url={silentURL} />
            </Box>
            {stemControlPane}
            <ControlPane
                playing={timeControl.playing}
                sectionLabel={currentSectionLabel}
                onPlay={playButton}
                onPause={timeControl.pause}
                onJumpBack={timeControl.jumpBack}
                onJumpForward={timeControl.jumpForward}
                onSkipBack={skipBack}
                onSkipForward={skipForward}
                onGoToBeginning={timeControl.goToBeginning}
                playrate={100}
                onPlayrateChange={() => {}}
            />
        </Box>
    );
};

export default LoadedFourStemTrackPlayer;
