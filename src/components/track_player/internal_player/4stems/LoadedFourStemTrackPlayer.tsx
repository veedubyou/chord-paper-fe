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
    volumePercentage: number;
}

type ToneNodes = Record<FourStemKeys, StemToneNodes>;
type PlayerState = {
    masterVolumePercentage: number;
    playratePercentage: number;
    stems: Record<FourStemKeys, StemState>;
};

interface LoadedFourStemTrackPlayerProps {
    show: boolean;
    currentTrack: boolean;
    audioBuffers: Record<FourStemKeys, AudioBuffer>;
    readonly timeSections: TimeSection[];
}

const createToneNodes = (audioBuffer: AudioBuffer): StemToneNodes => {
    const volumeNode = new Tone.Volume();
    const playerNode = new Tone.GrainPlayer({
        url: audioBuffer,
        grainSize: 0.1,
        overlap: 0.05,
    }).connect(volumeNode);

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
            volumePercentage: 100,
        }));

        return {
            masterVolumePercentage: 100,
            playratePercentage: 100,
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
        newPlayerState.masterVolumePercentage =
            event.currentTarget.volume * 100;
        setPlayerState(newPlayerState);
    };

    const commonReactPlayerProps: FilePlayerProps = {
        ref: playerRef,
        playing: timeControl.playing,
        controls: true,
        volume: playerState.masterVolumePercentage / 100,
        playbackRate: playerState.playratePercentage / 100,
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

        const playrate = playerState.playratePercentage / 100;

        // Tone transport doesn't observe slowed down time, only each individual node plays the sound back slower
        // e.g. if a 10s clip is played at 50% speed, then Tone transport will finish playing it from 0s to 20s
        // so to compare player time and Tone transport time, it needs to be scaled against the playrate
        const adjustedToneTime = Tone.Transport.seconds * playrate;

        // sync the time
        if (Math.abs(timeControl.currentTime - adjustedToneTime) > 1) {
            Tone.Transport.seconds = timeControl.currentTime / playrate;
        }
    }, [
        timeControl.playing,
        timeControl.currentTime,
        playerState.playratePercentage,
    ]);

    // synchronize player state and track volumes/mutedness
    useEffect(() => {
        let stemKey: FourStemKeys;
        for (stemKey in playerState.stems) {
            const stemState = playerState.stems[stemKey];
            const nodes = toneNodes[stemKey];

            const stemVolume =
                (stemState.volumePercentage / 100) *
                (playerState.masterVolumePercentage / 100);

            // don't set if fraction is 0, log of 0 is undefined
            if (stemVolume > 0) {
                const stemVolumeDecibels = 20 * Math.log10(stemVolume);
                nodes.volumeNode.volume.value = stemVolumeDecibels;
            }

            // mute needs to be set last because it can be overrided by volume
            nodes.endNode.mute = stemState.muted || stemVolume === 0;

            nodes.playerNode.playbackRate =
                playerState.playratePercentage / 100;
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
                volume: stemState.volumePercentage,
                onVolumeChanged: (newVolume: number) => {
                    const newPlayerState = lodash.cloneDeep(playerState);
                    newPlayerState.stems[stemKey].volumePercentage = newVolume;
                    setPlayerState(newPlayerState);
                },
            };
        };

        const stemControls = mapObject(playerState.stems, makeStemControl);

        return <FourStemControlPane {...stemControls} />;
    })();

    const handlePlayratePercentageChange = (newPlayratePercentage: number) => {
        setPlayerState({
            ...playerState,
            playratePercentage: newPlayratePercentage,
        });
    };

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
                playratePercentage={playerState.playratePercentage}
                onPlayratePercentageChange={handlePlayratePercentageChange}
            />
        </Box>
    );
};

export default LoadedFourStemTrackPlayer;
