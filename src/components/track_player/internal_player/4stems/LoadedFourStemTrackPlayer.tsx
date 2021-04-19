import { Box } from "@material-ui/core";
import audioBufferToWav from "audiobuffer-to-wav";
import lodash from "lodash";
import React, {
    ReactEventHandler,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import FilePlayer, { FilePlayerProps } from "react-player/file";
import * as Tone from "tone";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import {
    FourStemEmptyObject,
    FourStemKeys,
} from "../../../../common/ChordModel/Track";
import { mapObject } from "../../../../common/mapObject";
import { PlainFn } from "../../../../common/PlainFn";
import ControlPane from "../ControlPane";
import { useSections } from "../useSections";
import { useTimeControls } from "../useTimeControls";
import { getAudioCtx } from "./audioCtx";
import FourStemControlPane, { StemControl } from "./FourStemControlPane";

interface StemToneNodes {
    playerNode: Tone.GrainPlayer;
    volumeNode: Tone.Volume;
    endNode: Tone.Volume;
}

interface StemState {
    muted: boolean;
    volume: number;
}

type ToneNodes = Record<FourStemKeys, StemToneNodes>;
type PlayerState = {
    masterVolume: number;
    stems: Record<FourStemKeys, StemState>;
};

interface LoadedFourStemTrackPlayerProps {
    show: boolean;
    currentTrack: boolean;
    audioBuffers: Record<FourStemKeys, AudioBuffer>;
    readonly timeSections: TimeSection[];
    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
    onMinimize: PlainFn;
}

const createToneNodes = (audioBuffer: AudioBuffer): StemToneNodes => {
    const volumeNode = new Tone.Volume();
    const playerNode = new Tone.GrainPlayer({ url: audioBuffer }).connect(
        volumeNode
    );

    return {
        volumeNode: volumeNode,
        playerNode: playerNode,
        endNode: volumeNode,
    };
};

const createEmptySongURL = (time: number): string => {
    const audioCtx = getAudioCtx();
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
    const playerRef = useRef<FilePlayer>();
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

    const initialPlayerState: PlayerState = (() => {
        const stemStates = mapObject(FourStemEmptyObject, () => ({
            muted: false,
            volume: 100,
        }));

        return {
            masterVolume: 100,
            stems: stemStates,
        };
    })();

    const [playerState, setPlayerState] = useState<PlayerState>(
        initialPlayerState
    );

    const playerStateRef = useRef(playerState);
    playerStateRef.current = playerState;

    const silentURL = useMemo(
        () => createEmptySongURL(props.audioBuffers.bass.duration),
        [props.audioBuffers.bass.duration]
    );

    const handleMasterVolumeChange: ReactEventHandler<HTMLAudioElement> = (
        event: SyntheticEvent<HTMLAudioElement>
    ) => {
        // need to use ref, seems like changing this doesn't cause a rerender in react player
        const newPlayerState = lodash.cloneDeep(playerStateRef.current);
        newPlayerState.masterVolume = event.currentTarget.volume * 100;
        setPlayerState(newPlayerState);
    };

    const commonReactPlayerProps: FilePlayerProps = {
        ref: playerRef,
        playing: timeControl.playing,
        controls: true,
        volume: playerState.masterVolume / 100,
        playbackRate: 1, //TODO
        onPlay: timeControl.onPlay,
        onPause: timeControl.onPause,
        onProgress: timeControl.onProgress,
        progressInterval: 500,
        style: { minWidth: "50vw" },
        height: "auto",
        config: {
            forceAudio: true,
            attributes: {
                onVolumeChange: handleMasterVolumeChange,
            },
        },
    };

    const skipBack = timeControl.makeSkipBack(currentSection, previousSection);
    const skipForward = timeControl.makeSkipForward(nextSection);

    // synchronize the time control and tone transport
    useEffect(() => {
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
    }, [timeControl.playing, timeControl.currentTime]);

    // synchronize player state and track volumes/mutedness
    useEffect(() => {
        let stemKey: FourStemKeys;
        for (stemKey in playerState.stems) {
            const stemVolumeFraction =
                (playerState.stems[stemKey].volume / 100) *
                (playerState.masterVolume / 100);

            // don't set if fraction is 0, log of 0 is undefined
            if (stemVolumeFraction > 0) {
                const stemVolumeDecibels = 20 * Math.log10(stemVolumeFraction);
                toneNodes[stemKey].volumeNode.volume.value = stemVolumeDecibels;
            }

            // mute needs to be set last because it can be overrided by volume
            toneNodes[stemKey].endNode.mute =
                playerState.stems[stemKey].muted || stemVolumeFraction === 0;
        }
    }, [toneNodes, playerState]);

    // connect and disconnect nodes from the transport when not in focus
    // so that other tracks can use the transport
    useEffect(() => {
        if (props.currentTrack) {
            let stemKey: FourStemKeys;
            for (stemKey in toneNodes) {
                toneNodes[stemKey].playerNode.sync().start(0);
                toneNodes[stemKey].endNode.toDestination();
            }

            return () => {
                let stemKey: FourStemKeys;
                for (stemKey in toneNodes) {
                    toneNodes[stemKey].playerNode.unsync();
                    toneNodes[stemKey].endNode.disconnect();
                }
            };
        }
    }, [props.currentTrack, toneNodes]);

    // pause the track when user switches to a different track
    useEffect(() => {
        if (!props.currentTrack && timeControl.playing) {
            timeControl.onPause();
        }
    }, [props.currentTrack, timeControl]);

    // cleanup buffer resources when this component goes out of scope
    useEffect(() => {
        return () => {
            let stemKey: FourStemKeys;
            for (stemKey in toneNodes) {
                toneNodes[stemKey].volumeNode.dispose();
                toneNodes[stemKey].playerNode.dispose();
            }
        };
    }, [toneNodes]);

    const stemControlPane = (() => {
        const makeStemControl = (
            stemState: StemState,
            stemKey: FourStemKeys
        ): StemControl => {
            return {
                enabled: !stemState.muted,
                onEnabledChanged: (enabled: boolean) => {
                    const newPlayerState = lodash.cloneDeep(playerState);
                    newPlayerState.stems[stemKey].muted = !enabled;
                    setPlayerState(newPlayerState);
                },
                volume: stemState.volume,
                onVolumeChanged: (newVolume: number) => {
                    const newPlayerState = lodash.cloneDeep(playerState);
                    newPlayerState.stems[stemKey].volume = newVolume;
                    setPlayerState(newPlayerState);
                },
            };
        };

        const stemControls = mapObject(playerState.stems, makeStemControl);

        return <FourStemControlPane {...stemControls} />;
    })();

    return (
        <Box>
            <Box>
                <FilePlayer {...commonReactPlayerProps} url={silentURL} />
            </Box>
            {stemControlPane}
            <ControlPane
                show={props.show}
                playing={timeControl.playing}
                sectionLabel={currentSectionLabel}
                onPlay={timeControl.play}
                onPause={timeControl.pause}
                onJumpBack={timeControl.jumpBack}
                onJumpForward={timeControl.jumpForward}
                onSkipBack={skipBack}
                onSkipForward={skipForward}
                onGoToBeginning={timeControl.goToBeginning}
                onMinimize={props.onMinimize}
                playrate={100}
                onPlayrateChange={() => {}}
            />
        </Box>
    );
};

export default LoadedFourStemTrackPlayer;
