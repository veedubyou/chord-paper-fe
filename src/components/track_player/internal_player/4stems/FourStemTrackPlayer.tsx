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
import {
    FourStemEmptyObject,
    FourStemKeys,
    FourStemsTrack,
} from "../../../../common/ChordModel/Track";
import { FetchState } from "../../../../common/fetch";
import { mapObject } from "../../../../common/mapObject";
import { getAudioCtx } from "./audioCtx";
import LoadedFourStemTrackPlayer from "./LoadedFourStemTrackPlayer";

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: grey[100],
    },
}))(Box);

interface FourStemTrackPlayerProps {
    track: FourStemsTrack;
    readonly timeSections: TimeSection[];

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

interface SingleLoadingProgress {
    loadedBytes: number;
    totalBytes: number | null;
}
type ProgressHandler = (loadedBytes: number, totalBytes: number | null) => void;

type FetchResult = Record<FourStemKeys, AudioBuffer>;
type LoadingProgress = Record<FourStemKeys, SingleLoadingProgress>;

const FourStemTrackPlayer: React.FC<FourStemTrackPlayerProps> = (
    props: FourStemTrackPlayerProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<
        FetchState<FetchResult, LoadingProgress>
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
                const fetchResponses = mapObject(
                    props.track.stem_urls,
                    (url: string, stemKey: FourStemKeys) => {
                        const handleProgress = (progress: DownloadProgress) => {
                            const currentFetchState = fetchStateRef.current;
                            if (currentFetchState.state !== "loading") {
                                return;
                            }

                            const newFetchState = lodash.clone(
                                currentFetchState
                            );
                            newFetchState.details[stemKey].loadedBytes =
                                progress.transferredBytes;
                            newFetchState.details[stemKey].totalBytes =
                                progress.totalBytes === 0
                                    ? null
                                    : progress.totalBytes;

                            setFetchState(newFetchState);
                        };

                        return fetchAudioBuffer(url, handleProgress);
                    }
                );

                const [
                    bassBuffer,
                    drumsBuffer,
                    otherBuffer,
                    vocalsBuffer,
                ] = await Promise.all([
                    fetchResponses.bass,
                    fetchResponses.drums,
                    fetchResponses.other,
                    fetchResponses.vocals,
                ]);

                const players: FetchResult = {
                    bass: bassBuffer,
                    drums: drumsBuffer,
                    other: otherBuffer,
                    vocals: vocalsBuffer,
                };

                setFetchState({
                    state: "loaded",
                    item: players,
                });
            } catch (e) {
                console.error(e);
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
                details: mapObject(FourStemEmptyObject, () => ({
                    loadedBytes: 0,
                    totalBytes: null,
                })),
            });
        }
    }, [fetchState, setFetchState, props.track.stem_urls]);

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
        const totalBytes: number | null = (() => {
            let total = 0;
            let stemKey: FourStemKeys;
            for (stemKey in fetchState.details) {
                const stemTotal = fetchState.details[stemKey].totalBytes;
                if (stemTotal === null) {
                    return null;
                }

                total += stemTotal;
            }
            return total;
        })();

        const loadedBytes: number = (() => {
            let loaded = 0;
            let stemKey: FourStemKeys;
            for (stemKey in fetchState.details) {
                loaded += fetchState.details[stemKey].loadedBytes;
            }
            return loaded;
        })();

        let formattedProgress = prettyBytes(loadedBytes);
        if (totalBytes !== null) {
            formattedProgress += "/" + prettyBytes(totalBytes);
        }

        const progressBar = (() => {
            if (totalBytes === null) {
                return <LinearProgress />;
            }

            const percent = (loadedBytes / totalBytes) * 100;
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

    return (
        <LoadedFourStemTrackPlayer
            audioBuffers={fetchState.item}
            timeSections={props.timeSections}
            playrate={props.playrate}
            onPlayrateChange={props.onPlayrateChange}
        />
    );
};

export default FourStemTrackPlayer;
