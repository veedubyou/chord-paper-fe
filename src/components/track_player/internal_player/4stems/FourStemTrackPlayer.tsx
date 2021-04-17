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
import ky from "ky";
import React, { useEffect, useState } from "react";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import {
    FourStemKeys,
    FourStemsTrack,
} from "../../../../common/ChordModel/Track";
import { FetchState } from "../../../../common/fetch";
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

type FetchResult = Record<FourStemKeys, AudioBuffer>;

const FourStemTrackPlayer: React.FC<FourStemTrackPlayerProps> = (
    props: FourStemTrackPlayerProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<FetchState<FetchResult>>({
        state: "not-started",
    });

    const fetchAudioBuffer = async (url: string): Promise<AudioBuffer> => {
        const response = await ky
            .get(url, {
                timeout: false,
            })
            .arrayBuffer();

        return await getAudioCtx().decodeAudioData(response);
    };

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const [
                    bassPlayer,
                    drumsPlayer,
                    otherPlayer,
                    vocalsPlayer,
                ] = await Promise.all([
                    fetchAudioBuffer(props.track.stem_urls.bass),
                    fetchAudioBuffer(props.track.stem_urls.drums),
                    fetchAudioBuffer(props.track.stem_urls.other),
                    fetchAudioBuffer(props.track.stem_urls.vocals),
                ]);

                const players: FetchResult = {
                    bass: bassPlayer,
                    drums: drumsPlayer,
                    other: otherPlayer,
                    vocals: vocalsPlayer,
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
        return (
            <PaddedBox>
                <Typography variant="body1">Loading track...</Typography>
                <LinearProgress />
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
