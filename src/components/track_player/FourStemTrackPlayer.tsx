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
import audioBufferToWav from "audiobuffer-to-wav";
import ky from "ky";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import * as Tone from "tone";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { FourStemsTrack } from "../../common/ChordModel/Track";
import { FetchState } from "../../common/fetch";
import ControlPane from "./ControlPane";
import { useSections } from "./useSections";
import { ButtonActionAndState, useTimeControls } from "./useTimeControls";

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: grey[100],
    },
}))(Box);

interface LoadedPlayers {
    bass: Tone.GrainPlayer;
    drums: Tone.GrainPlayer;
    other: Tone.GrainPlayer;
    vocals: Tone.GrainPlayer;
    silentURL: string;
}

interface FourStemTrackPlayerProps {
    track: FourStemsTrack;
    readonly timeSections: TimeSection[];

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

const FourStemTrackPlayer: React.FC<FourStemTrackPlayerProps> = (
    props: FourStemTrackPlayerProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<FetchState<LoadedPlayers>>({
        state: "not-started",
    });
    const playerRef = useRef<ReactPlayer>();
    const timeControl = useTimeControls(playerRef.current);

    const [
        currentSectionLabel,
        currentSection,
        previousSection,
        nextSection,
    ] = useSections(props.timeSections, timeControl.currentTime);

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

    const audioCtxRef = useRef(new window.AudioContext());

    const fetchAndCreatePlayer = async (
        url: string
    ): Promise<Tone.GrainPlayer> => {
        const response = await ky.get(url, { timeout: false }).arrayBuffer();
        const audioBuffer = await audioCtxRef.current.decodeAudioData(response);

        return new Tone.GrainPlayer({ url: audioBuffer })
            .toDestination()
            .sync()
            .start(0);
    };

    const createEmptySongURL = (time: number): string => {
        const audioBuffer = audioCtxRef.current.createBuffer(
            2,
            audioCtxRef.current.sampleRate * time,
            audioCtxRef.current.sampleRate
        );

        const arrayBuffer = audioBufferToWav(audioBuffer);
        const blob = new window.Blob([arrayBuffer]);
        return URL.createObjectURL(blob);
    };

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
                    fetchAndCreatePlayer(props.track.stems.bass_url),
                    fetchAndCreatePlayer(props.track.stems.drums_url),
                    fetchAndCreatePlayer(props.track.stems.other_url),
                    fetchAndCreatePlayer(props.track.stems.vocals_url),
                ]);

                const duration = bassPlayer.buffer.duration;
                const silentURL = createEmptySongURL(duration);

                const players: LoadedPlayers = {
                    bass: bassPlayer,
                    drums: drumsPlayer,
                    other: otherPlayer,
                    vocals: vocalsPlayer,
                    silentURL: silentURL,
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
    }, [fetchState, setFetchState, props.track.stems]);

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

    syncToneTransport();

    return (
        <Box>
            <Box>
                <ReactPlayer
                    {...commonReactPlayerProps}
                    url={fetchState.item.silentURL}
                />
            </Box>
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

export default FourStemTrackPlayer;
