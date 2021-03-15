import React, { useRef } from "react";
import { Paper, Typography, Theme, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { inflatingWhitespace } from "../../common/Whitespace";
import audioBufferToWav from "audiobuffer-to-wav";
import ky from "ky";
import shortid from "shortid";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        minWidth: theme.spacing(92),
    },
}))(Paper);

const About: React.FC<{}> = (): JSX.Element => {
    const createEmptySongURL = (time: number): string => {
        const audioCtx = new window.AudioContext();
        const audioBuffer = audioCtx.createBuffer(
            2,
            audioCtx.sampleRate * time,
            audioCtx.sampleRate
        );

        const arrayBuffer = audioBufferToWav(audioBuffer);
        const blob = new window.Blob([arrayBuffer]);
        return URL.createObjectURL(blob);
    };

    const publicURL = (a: string) => process.env.PUBLIC_URL + "/sounds/" + a;

    const urls = {
        bass: publicURL("bass.mp3"),
        drums: publicURL("drums.mp3"),
        other: publicURL("other.mp3"),
        vocal: publicURL("vocals.mp3"),
    };

    const audioCtxRef = useRef(new window.AudioContext());
    const audioCtx = audioCtxRef.current;

    const createBufferSources = () => ({
        bass: audioCtx.createBufferSource(),
        drums: audioCtx.createBufferSource(),
        other: audioCtx.createBufferSource(),
        vocal: audioCtx.createBufferSource(),
    });

    const bufferSources = useRef(createBufferSources());

    const gains = useRef({
        bass: audioCtx.createGain(),
        drums: audioCtx.createGain(),
        other: audioCtx.createGain(),
        vocal: audioCtx.createGain(),
    });

    const doit = async () => {
        const [
            bassBuffer,
            drumsBuffer,
            othersBuffer,
            vocalBuffer,
        ] = await Promise.all([
            ky.get(urls.bass, { timeout: 60000 }).arrayBuffer(),
            ky.get(urls.drums, { timeout: 60000 }).arrayBuffer(),
            ky.get(urls.other, { timeout: 60000 }).arrayBuffer(),
            ky.get(urls.vocal, { timeout: 60000 }).arrayBuffer(),
        ]);

        const [bassData, drumsData, othersData, vocalData] = await Promise.all([
            audioCtx.decodeAudioData(bassBuffer),
            audioCtx.decodeAudioData(drumsBuffer),
            audioCtx.decodeAudioData(othersBuffer),
            audioCtx.decodeAudioData(vocalBuffer),
        ]);

        bufferSources.current.bass.buffer = bassData;
        bufferSources.current.drums.buffer = drumsData;
        bufferSources.current.other.buffer = othersData;
        bufferSources.current.vocal.buffer = vocalData;

        bufferSources.current.bass.connect(gains.current.bass);
        bufferSources.current.drums.connect(gains.current.drums);
        bufferSources.current.other.connect(gains.current.other);
        bufferSources.current.vocal.connect(gains.current.vocal);

        gains.current.bass.connect(audioCtx.destination);
        gains.current.drums.connect(audioCtx.destination);
        gains.current.other.connect(audioCtx.destination);
        gains.current.vocal.connect(audioCtx.destination);

        console.log("DONE");
    };

    const startPlaying = () => {
        bufferSources.current.bass.start();
        bufferSources.current.drums.start();
        bufferSources.current.other.start();
        bufferSources.current.vocal.start();
    };

    const stopPlaying = () => {
        bufferSources.current.bass.stop();
        bufferSources.current.drums.stop();
        bufferSources.current.other.stop();
        bufferSources.current.vocal.stop();

        const newSources = createBufferSources();
        newSources.bass.buffer = bufferSources.current.bass.buffer;
        newSources.drums.buffer = bufferSources.current.drums.buffer;
        newSources.other.buffer = bufferSources.current.other.buffer;
        newSources.vocal.buffer = bufferSources.current.vocal.buffer;
        bufferSources.current = newSources;

        bufferSources.current.bass.connect(gains.current.bass);
        bufferSources.current.drums.connect(gains.current.drums);
        bufferSources.current.other.connect(gains.current.other);
        bufferSources.current.vocal.connect(gains.current.vocal);
    };

    const seek = (time: number) => {
        // stopPlaying();
        bufferSources.current.bass.start(0, time);
        bufferSources.current.drums.start(0, time);
        bufferSources.current.other.start(0, time);
        bufferSources.current.vocal.start(0, time);
    };

    const muteVocals = () => {
        gains.current.vocal.gain.setValueAtTime(
            0,
            audioCtxRef.current.currentTime
        );
    };

    const unmuteVocals = () => {
        gains.current.vocal.gain.setValueAtTime(
            1,
            audioCtxRef.current.currentTime
        );
    };

    // const objectURL = createEmptySongURL(4 * 60 + 32);

    return (
        <Grid container data-testid="About">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    {/* <audio controls src={objectURL} /> */}
                    <Button onClick={doit}>SETUP</Button>

                    <Button onClick={startPlaying}>PLAY IT</Button>
                    <Button onClick={stopPlaying}>STOP IT</Button>

                    <Button onClick={muteVocals}>MUTE IT</Button>
                    <Button onClick={unmuteVocals}>UNMUTE IT</Button>
                    <Button onClick={() => seek(60)}>JUMP IT</Button>

                    <Typography variant="h6">About Chord Paper</Typography>
                    <Typography variant="h6">
                        {inflatingWhitespace()}
                    </Typography>
                    <Typography>
                        Chord Paper makes writing and reading chord sheets
                        easier than the traditional monospace font formatting.
                        It's a passion project born out of frustration at the
                        clunkiness of writing chords on a computer.
                    </Typography>
                    <Typography>{inflatingWhitespace()}</Typography>
                    <Typography>
                        Hope you will find that Chord Paper helps you focus more
                        of your musical time on playing and listening, and less
                        on formatting.
                    </Typography>
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export default About;
