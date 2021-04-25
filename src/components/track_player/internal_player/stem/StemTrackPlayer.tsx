import {
    Box,
    Button,
    LinearProgress,
    Theme,
    Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import RefreshIcon from "@material-ui/icons/Refresh";
import { withStyles } from "@material-ui/styles";
import ky, { DownloadProgress } from "ky";
import lodash from "lodash";
import prettyBytes from "pretty-bytes";
import React, { useEffect, useRef, useState } from "react";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import { StemTrack } from "../../../../common/ChordModel/tracks/StemTrack";
import { DetailedLoadingFetchState } from "../../../../common/fetch";
import { mapObject } from "../../../../common/mapObject";
import { getAudioCtx } from "./audioCtx";
import LoadedStemTrackPlayer from "./LoadedStemTrackPlayer";
import { ControlPaneButtonColour } from "./StemTrackControlPane";

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: grey[100],
    },
}))(Box);

export interface StemButtonSpec<StemKey extends string> {
    label: StemKey;
    buttonColour: ControlPaneButtonColour;
}

interface StemTrackPlayerProps<StemKey extends string> {
    show: boolean;
    currentTrack: boolean;

    track: StemTrack<StemKey>;
    buttonSpecs: StemButtonSpec<StemKey>[];

    readonly timeSections: TimeSection[];
}

interface SingleLoadingProgress {
    loadedBytes: number;
    totalBytes: number | "initial" | "unknown";
}

type FetchResult<StemKey extends string> = Record<StemKey, AudioBuffer>;
type LoadingProgress<StemKey extends string> = Record<
    StemKey,
    SingleLoadingProgress
>;

const StemTrackPlayer = <StemKey extends string>(
    props: StemTrackPlayerProps<StemKey>
): JSX.Element => {
    const [fetchState, setFetchState] = useState<
        DetailedLoadingFetchState<
            FetchResult<StemKey>,
            LoadingProgress<StemKey>
        >
    >({
        state: "not-started",
    });

    const fetchStateRef = useRef(fetchState);
    fetchStateRef.current = fetchState;

    const fetchAudioBuffer = async (
        url: string,
        handleProgress: (progress: DownloadProgress) => void
    ): Promise<AudioBuffer> => {
        const response = await ky
            .get(url, {
                timeout: false,
                onDownloadProgress: handleProgress,
            })
            .arrayBuffer();

        return await getAudioCtx().decodeAudioData(response);
    };

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const fetchAudioBufferWithProgress = (
                    url: string,
                    stemKey: StemKey
                ) => {
                    const handleProgress = (progress: DownloadProgress) => {
                        const currentFetchState = fetchStateRef.current;
                        if (currentFetchState.state !== "loading") {
                            return;
                        }

                        const newFetchState = lodash.clone(currentFetchState);
                        newFetchState.details[stemKey].loadedBytes =
                            progress.transferredBytes;
                        newFetchState.details[stemKey].totalBytes =
                            progress.totalBytes !== 0
                                ? progress.totalBytes
                                : "unknown";

                        setFetchState(newFetchState);
                    };

                    const audioBufferPromise = fetchAudioBuffer(
                        url,
                        handleProgress
                    );

                    return audioBufferPromise.then(
                        (audioBuffer: AudioBuffer) => ({
                            audioBuffer: audioBuffer,
                            stemKey: stemKey,
                        })
                    );
                };

                type BufferKeyPair = {
                    audioBuffer: AudioBuffer;
                    stemKey: StemKey;
                };

                const audioBufferPromises: Promise<BufferKeyPair>[] = [];
                {
                    let stemKey: StemKey;
                    for (stemKey in props.track.stem_urls) {
                        const bufferPromise = fetchAudioBufferWithProgress(
                            props.track.stem_urls[stemKey],
                            stemKey
                        );
                        audioBufferPromises.push(bufferPromise);
                    }
                }

                const resolvedKeyBuffers = await Promise.all(
                    audioBufferPromises
                );

                let encounteredError = false;
                const audioBuffers = mapObject(
                    props.track.keyObject(),
                    (_empty: undefined, stemKey: StemKey) => {
                        const searchResult = resolvedKeyBuffers.find(
                            (value: BufferKeyPair) => value.stemKey === stemKey
                        );

                        if (searchResult === undefined) {
                            encounteredError = true;
                            return new AudioBuffer({
                                length: 0,
                                sampleRate: 1,
                            });
                        }

                        return searchResult.audioBuffer;
                    }
                );

                if (encounteredError) {
                    setFetchState({
                        state: "error",
                        error: new Error(
                            "Could not find stem key in audio buffer array to object mapping"
                        ),
                    });
                    return;
                }

                setFetchState({
                    state: "loaded",
                    item: audioBuffers,
                });
            } catch (e) {
                setFetchState({
                    state: "error",
                    error: e,
                });
                return;
            }
        };

        if (fetchState.state === "not-started") {
            loadPlayers();
            setFetchState({
                state: "loading",
                details: mapObject(
                    props.track.keyObject(),
                    (): SingleLoadingProgress => ({
                        loadedBytes: 0,
                        totalBytes: "initial",
                    })
                ),
            });
        }
    }, [fetchState, setFetchState, props.track]);

    if (fetchState.state === "not-started") {
        return (
            <PaddedBox>
                <Typography variant="body1">
                    Tracks have not started loading...
                </Typography>
            </PaddedBox>
        );
    }

    if (fetchState.state === "loading") {
        const totalBytes: number | "unknown" | "initial" = (() => {
            let total = 0;
            let stemKey: StemKey;
            for (stemKey in fetchState.details) {
                const stemTotal = fetchState.details[stemKey].totalBytes;

                switch (stemTotal) {
                    case "unknown": {
                        return "unknown";
                    }

                    case "initial": {
                        return "initial";
                    }

                    default: {
                        total += stemTotal;
                        break;
                    }
                }
            }
            return total;
        })();

        const loadedBytes: number = (() => {
            let loaded = 0;
            let stemKey: StemKey;
            for (stemKey in fetchState.details) {
                loaded += fetchState.details[stemKey].loadedBytes;
            }
            return loaded;
        })();

        let formattedProgress = prettyBytes(loadedBytes);
        if (totalBytes !== "unknown" && totalBytes !== "initial") {
            formattedProgress += "/" + prettyBytes(totalBytes);
        }

        const progressBar = (() => {
            if (totalBytes === "unknown") {
                return <LinearProgress />;
            }

            const percent: number = (() => {
                if (totalBytes === "initial") {
                    // we don't know everything yet, just conservatively pretend it's out of 100MB
                    // so the bar won't go backwards
                    const pretendTotalBytes = 100 * 1000 * 1000;
                    return (loadedBytes / pretendTotalBytes) * 100;
                }

                return (loadedBytes / totalBytes) * 100;
            })();

            return <LinearProgress variant="determinate" value={percent} />;
        })();

        const label = (() => {
            if (loadedBytes === totalBytes) {
                return "Processing track...";
            }

            return "Loading track...";
        })();

        return (
            <PaddedBox>
                <Typography variant="body1">
                    {label}({formattedProgress})
                </Typography>
                {progressBar}
            </PaddedBox>
        );
    }

    if (fetchState.state === "error") {
        console.error(fetchState.error);
        const refresh = () => {
            setFetchState({ state: "not-started" });
        };

        return (
            <PaddedBox display="flex" alignItems="center">
                <Button onClick={refresh}>
                    <RefreshIcon />
                </Button>
                <Typography variant="body1">Failed to load tracks</Typography>
            </PaddedBox>
        );
    }

    const stems = props.buttonSpecs.map(
        (buttonSpec: StemButtonSpec<StemKey>) => {
            return {
                ...buttonSpec,
                audioBuffer: fetchState.item[buttonSpec.label],
            };
        }
    );

    return (
        <LoadedStemTrackPlayer
            show={props.show}
            currentTrack={props.currentTrack}
            stems={stems}
            timeSections={props.timeSections}
        />
    );
};

export default StemTrackPlayer;
