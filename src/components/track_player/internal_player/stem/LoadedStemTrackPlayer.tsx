import { Box } from "@mui/material";
import audioBufferToWav from "audiobuffer-to-wav";
import { PlainFn } from "common/PlainFn";
import ControlPane from "components/track_player/internal_player/ControlPane";
import { makeFilePlayerProps } from "components/track_player/internal_player/reactPlayerProps";
import { getAudioCtx } from "components/track_player/internal_player/stem/audioCtx";
import StemTrackControlPane, {
    ControlPaneButtonColour,
    StemControl,
} from "components/track_player/internal_player/stem/StemTrackControlPane";
import { PlayerControls } from "components/track_player/internal_player/usePlayerControls";
import lodash from "lodash";
import { useSnackbar } from "notistack";
import React, {
    ReactEventHandler,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import FilePlayer from "react-player/file";
import { useLocation } from "react-router-dom";
import * as Tone from "tone";

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
    masterPitchShift: number;
    stems: StemState<StemKey>[];
};

export interface StemInput<StemKey extends string> {
    label: StemKey;
    buttonColour: ControlPaneButtonColour;
    audioBuffer: AudioBuffer;
}

interface LoadedStemTrackPlayerProps<StemKey extends string> {
    showing: boolean;
    stems: StemInput<StemKey>[];
    playerControls: PlayerControls;
    refreshTrackFn: PlainFn;
}

const createToneNodes = <StemKey extends string>(
    stem: StemInput<StemKey>,
    grainSize: number,
    overlap: number
): StemToneNodes<StemKey> => {
    const volumeNode = new Tone.Volume();

    const playerNode = new Tone.GrainPlayer({
        url: stem.audioBuffer,
        grainSize: grainSize,
        overlap: overlap,
    });

    playerNode.chain(volumeNode);

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

const parseQueryString = (input: string | null, defaultVal: number): number => {
    if (input === null) {
        return defaultVal;
    }

    const parsed = parseFloat(input);
    if (Number.isNaN(parsed)) {
        return defaultVal;
    }

    return parsed;
};

const LoadedStemTrackPlayer = <StemKey extends string>(
    props: LoadedStemTrackPlayerProps<StemKey>
): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const grainSize = parseQueryString(query.get("g"), 0.1);
    const overlap = parseQueryString(query.get("o"), 0.1);

    const toneNodes: ToneNodes<StemKey> = useMemo(
        () =>
            props.stems.map((stemKey) =>
                createToneNodes(stemKey, grainSize, overlap)
            ),
        [props.stems, grainSize, overlap]
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
            masterPitchShift: 0,
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

    const refreshTrackFn = props.refreshTrackFn;

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
            refreshTrackFn();
        }
    }, [enqueueSnackbar, props.stems, refreshTrackFn]);

    // synchronize the playing state
    useEffect(() => {
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
    }, [props.playerControls.playing]);

    // TODO: remove completely after understanding player out of sync bug
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log("Tone control current state", Tone.Transport.state);
            console.log("Tone control current time", Tone.Transport.seconds);
        }, 5000);

        return () => clearInterval(intervalID);
    }, []);

    const { tempo, getCurrentTime } = props.playerControls;
    // synchronize time
    useEffect(() => {
        const synchronizeTime = () => {
            const tempoValue = tempo.percentage / 100;

            // Tone transport doesn't observe slowed down time, only each individual node plays the sound back slower
            // e.g. if a 10s clip is played at 50% speed, then Tone transport will finish playing it from 0s to 20s
            // so to compare player time and Tone transport time, it needs to be scaled against the tempo
            const adjustedToneTime = Tone.Transport.seconds * tempoValue;

            const currentTime = getCurrentTime();

            if (Math.abs(currentTime - adjustedToneTime) > 1) {
                Tone.Transport.seconds = currentTime / tempoValue;
            }
        };

        const intervalID = setInterval(synchronizeTime, 250);
        return () => clearInterval(intervalID);
    }, [getCurrentTime, tempo.percentage]);

    // synchronize player state and track volumes/mutedness
    useEffect(() => {
        playerState.stems.forEach(
            (stemState: StemState<StemKey>, stemIndex: number) => {
                const node = toneNodes[stemIndex];

                const stemVolume =
                    (stemState.volumePercentage / 100) *
                    (playerState.masterVolumePercentage / 100);

                // don't set if fraction is 0, log of 0 is undefined
                if (stemVolume > 0) {
                    const stemVolumeDecibels = 20 * Math.log10(stemVolume);
                    node.volumeNode.volume.value = stemVolumeDecibels;
                }

                // mute needs to be set last because it can be overrided by volume
                node.endNode.mute = stemState.muted || stemVolume === 0;

                node.playerNode.playbackRate =
                    props.playerControls.tempo.percentage / 100;
            }
        );
    }, [toneNodes, playerState, props.playerControls.tempo.percentage]);

    // synchronize player state and pitch shift
    useEffect(() => {
        playerState.stems.forEach(
            (_stemState: StemState<StemKey>, stemIndex: number) => {
                const node = toneNodes[stemIndex];

                // a hard coded hack - drums don't sound good pitch shifted
                // and also don't need to be harmonically in step with all the
                // other tracks
                const pitchShift = node.label !== "drums";
                if (pitchShift) {
                    node.playerNode.detune = playerState.masterPitchShift * 100;
                }
            }
        );
    }, [toneNodes, playerState]);

    // connect and disconnect nodes from the transport when not in focus
    // so that other tracks can use the transport
    useEffect(() => {
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
    }, [toneNodes]);

    // cleanup buffer resources when this component goes out of scope
    useEffect(() => {
        return () => {
            toneNodes.forEach((toneNode: StemToneNodes<StemKey>) => {
                toneNode.volumeNode.dispose();
                toneNode.playerNode.dispose();
                console.log("Disposing...", toneNode.label);
            });
        };
    }, [toneNodes]);

    const makeStemControl = useCallback(
        (
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
        },
        [playerState, props.stems]
    );

    const stemControls = useMemo(
        () => playerState.stems.map(makeStemControl),
        [playerState.stems, makeStemControl]
    );

    const stemControlPane = (
        <StemTrackControlPane stemControls={stemControls} />
    );

    const handlePitchShift = useCallback(
        (newPitchShift: number) => {
            setPlayerState({
                ...playerState,
                masterPitchShift: newPitchShift,
            });
        },
        [playerState, setPlayerState]
    );

    const transposeControl = useMemo(
        () => ({
            level: playerState.masterPitchShift,
            onChange: handlePitchShift,
        }),
        [playerState, handlePitchShift]
    );

    return (
        <Box>
            <Box>
                <FilePlayer {...filePlayerProps} url={silentURL} />
            </Box>
            {stemControlPane}
            <ControlPane
                showing={props.showing}
                playing={props.playerControls.playing}
                transport={props.playerControls.transport}
                tempo={props.playerControls.tempo}
                abLoop={props.playerControls.abLoop}
                transpose={transposeControl}
            />
        </Box>
    );
};

export default React.memo(LoadedStemTrackPlayer);
