import { Box } from "@material-ui/core";
import audioBufferToWav from "audiobuffer-to-wav";
import lodash from "lodash";
import { useSnackbar } from "notistack";
import React, {
    ReactEventHandler,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import FilePlayer from "react-player/file";
import * as Tone from "tone";
import ControlPane from "../ControlPane";
import { makeFilePlayerProps } from "../reactPlayerProps";
import { PlayerControls } from "../usePlayerControls";
import { getAudioCtx } from "./audioCtx";
import StemTrackControlPane, {
    ControlPaneButtonColour,
    StemControl,
} from "./StemTrackControlPane";

interface StemToneNodes<StemKey extends string> {
    label: StemKey;
    playerNode: Tone.GrainPlayer;
    volumeNode: Tone.Volume;
    endNode: Tone.Volume;
}

interface StemState<StemKey extends string> {
    key: StemKey;
    muted: boolean;
    volumePercentage: number;
}

type ToneNodes<StemKey extends string> = StemToneNodes<StemKey>[];

type PlayerState<StemKey extends string> = {
    masterVolumePercentage: number;
    stems: StemState<StemKey>[];
};

export interface StemInput<StemKey extends string> {
    label: StemKey;
    buttonColour: ControlPaneButtonColour;
    audioBuffer: AudioBuffer;
}

interface LoadedStemTrackPlayerProps<StemKey extends string> {
    focused: boolean;
    currentTrack: boolean;
    stems: StemInput<StemKey>[];
    playerControls: PlayerControls;
}

const createToneNodes = <StemKey extends string>(
    stem: StemInput<StemKey>
): StemToneNodes<StemKey> => {
    const volumeNode = new Tone.Volume();
    const playerNode = new Tone.GrainPlayer({
        url: stem.audioBuffer,
        grainSize: 0.1,
        overlap: 0.1,
    }).chain(volumeNode);

    return {
        label: stem.label,
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

const LoadedStemTrackPlayer = <StemKey extends string>(
    props: LoadedStemTrackPlayerProps<StemKey>
): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();

    const toneNodes: ToneNodes<StemKey> = useMemo(
        () => props.stems.map(createToneNodes),
        [props.stems]
    );

    const initialPlayerState: PlayerState<StemKey> = (() => {
        const stemStates: StemState<StemKey>[] = props.stems.map(
            (stem: StemInput<StemKey>) => {
                return {
                    key: stem.label,
                    muted: false,
                    volumePercentage: 100,
                };
            }
        );

        return {
            masterVolumePercentage: 100,
            stems: stemStates,
        };
    })();

    const [playerState, setPlayerState] =
        useState<PlayerState<StemKey>>(initialPlayerState);

    const playerStateRef = useRef(playerState);
    playerStateRef.current = playerState;

    const silentURL: string = useMemo(() => {
        if (props.stems.length === 0) {
            return "";
        }

        return createEmptySongURL(props.stems[0].audioBuffer.duration);
    }, [props.stems]);

    const handleMasterVolumeChange: ReactEventHandler<HTMLAudioElement> = (
        event: SyntheticEvent<HTMLAudioElement>
    ) => {
        // need to use ref, seems like changing this doesn't cause a rerender in react player
        const newPlayerState = lodash.cloneDeep(playerStateRef.current);
        newPlayerState.masterVolumePercentage =
            event.currentTarget.volume * 100;
        setPlayerState(newPlayerState);
    };

    const filePlayerProps = makeFilePlayerProps(
        props.playerControls,
        playerState.masterVolumePercentage,
        handleMasterVolumeChange
    );

    // check the integrity of the loaded tracks - they should all be the same length
    // otherwise there could be a loading error
    useEffect(() => {
        let minDuration: number | null = null;
        let maxDuration: number | null = null;

        for (const stem of props.stems) {
            const buffer = stem.audioBuffer;
            if (minDuration === null || buffer.duration < minDuration) {
                minDuration = buffer.duration;
            }

            if (maxDuration === null || buffer.duration > maxDuration) {
                maxDuration = buffer.duration;
            }
        }

        if (maxDuration === null || minDuration === null) {
            return;
        }

        if (maxDuration - minDuration > 1) {
            enqueueSnackbar(
                "Mismatch in length of tracks loaded, try refreshing",
                { variant: "warning" }
            );
        }
    }, [enqueueSnackbar, props.stems]);

    // synchronize the time control and tone transport
    useEffect(() => {
        // sync the play state
        if (
            props.playerControls.playing &&
            Tone.Transport.state !== "started"
        ) {
            Tone.Transport.start();
        } else if (
            !props.playerControls.playing &&
            Tone.Transport.state !== "paused" &&
            Tone.Transport.state !== "stopped"
        ) {
            Tone.Transport.pause();
        }

        const playrate = props.playerControls.playratePercentage / 100;

        // Tone transport doesn't observe slowed down time, only each individual node plays the sound back slower
        // e.g. if a 10s clip is played at 50% speed, then Tone transport will finish playing it from 0s to 20s
        // so to compare player time and Tone transport time, it needs to be scaled against the playrate
        const adjustedToneTime = Tone.Transport.seconds * playrate;

        // sync the time
        if (Math.abs(props.playerControls.currentTime - adjustedToneTime) > 1) {
            Tone.Transport.seconds =
                props.playerControls.currentTime / playrate;
        }
    }, [
        props.playerControls.playing,
        props.playerControls.currentTime,
        props.playerControls.playratePercentage,
    ]);

    // synchronize player state and track volumes/mutedness
    useEffect(() => {
        playerState.stems.forEach(
            (stemState: StemState<StemKey>, stemIndex: number) => {
                const nodes = toneNodes[stemIndex];

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
                    props.playerControls.playratePercentage / 100;
            }
        );
    }, [toneNodes, playerState, props.playerControls.playratePercentage]);

    // connect and disconnect nodes from the transport when not in focus
    // so that other tracks can use the transport
    useEffect(() => {
        if (props.currentTrack) {
            toneNodes.forEach((toneNode: StemToneNodes<StemKey>) => {
                toneNode.playerNode.sync().start(0);
                toneNode.endNode.toDestination();
            });

            return () => {
                toneNodes.forEach((toneNode: StemToneNodes<StemKey>) => {
                    toneNode.playerNode.unsync();
                    toneNode.endNode.disconnect();
                });
            };
        }
    }, [props.currentTrack, toneNodes]);

    // pause the track when user switches to a different track
    useEffect(() => {
        if (!props.currentTrack && props.playerControls.playing) {
            props.playerControls.onPause();
        }
    }, [props.currentTrack, props.playerControls]);

    // cleanup buffer resources when this component goes out of scope
    useEffect(() => {
        return () => {
            toneNodes.forEach((toneNode: StemToneNodes<StemKey>) => {
                toneNode.volumeNode.dispose();
                toneNode.playerNode.dispose();
            });
        };
    }, [toneNodes]);

    const stemControlPane = (() => {
        const makeStemControl = (
            stemState: StemState<StemKey>,
            stemIndex: number
        ): StemControl<StemKey> => {
            const buttonColour: ControlPaneButtonColour = (() => {
                const stemInput = props.stems.find(
                    (value: StemInput<StemKey>) => value.label === stemState.key
                );
                if (stemInput === undefined) {
                    return "white";
                }

                return stemInput.buttonColour;
            })();

            return {
                label: stemState.key,
                buttonColour: buttonColour,
                enabled: !stemState.muted,
                onEnabledChanged: (enabled: boolean) => {
                    const newPlayerState = lodash.cloneDeep(playerState);
                    newPlayerState.stems[stemIndex].muted = !enabled;
                    setPlayerState(newPlayerState);
                },
                volume: stemState.volumePercentage,
                onVolumeChanged: (newVolume: number) => {
                    const newPlayerState = lodash.cloneDeep(playerState);
                    newPlayerState.stems[stemIndex].volumePercentage =
                        newVolume;
                    setPlayerState(newPlayerState);
                },
            };
        };

        const stemControls = playerState.stems.map(makeStemControl);

        return <StemTrackControlPane<StemKey> stemControls={stemControls} />;
    })();

    return (
        <Box>
            <Box>
                <FilePlayer {...filePlayerProps} url={silentURL} />
            </Box>
            {stemControlPane}
            <ControlPane
                show={props.focused}
                playing={props.playerControls.playing}
                sectionLabel={props.playerControls.currentSectionLabel}
                onTogglePlay={props.playerControls.togglePlay}
                onJumpBack={props.playerControls.jumpBack}
                onJumpForward={props.playerControls.jumpForward}
                onSkipBack={props.playerControls.skipBack}
                onSkipForward={props.playerControls.skipForward}
                onGoToBeginning={props.playerControls.goToBeginning}
                playratePercentage={props.playerControls.playratePercentage}
                onPlayratePercentageChange={
                    props.playerControls.onPlayratePercentageChange
                }
            />
        </Box>
    );
};

export default LoadedStemTrackPlayer;
