import React from "react";
import {
    Theme,
    ThemeProvider,
    createMuiTheme,
    PaletteColorOptions,
    Grid,
} from "@material-ui/core";
import { tokenize } from "./common/LyricTokenizer";
import { ChordSong, ChordLine, ChordBlock } from "./common/ChordModel";
import ChordPaper from "./components/ChordPaper";
import { SnackbarProvider } from "notistack";

const createTheme = (): Theme => {
    const lightBlue: PaletteColorOptions = {
        main: "#4fc3f7",
        light: "#8bf6ff",
        dark: "#0093c4",
        contrastText: "#000000",
    };

    const purple: PaletteColorOptions = {
        main: "#844ffc",
        light: "#bb7eff",
        dark: "#4a1fc8",
        contrastText: "#ffffff",
    };

    return createMuiTheme({
        palette: {
            primary: lightBlue,
            secondary: purple,
        },
        typography: {
            fontFamily: "Playfair",
            fontWeightRegular: 500,
        },
    });
};

function App() {
    const theme: Theme = createTheme();

    const lyrics = [
        "We're no strangers to love",
        "You know the rules and so do I",
        "A full commitment's what I'm thinking of",
        "You wouldn't get this from any other guy",
        "I just wanna tell you how I'm feeling",
        "Gotta make you understand",
        "Never gonna give you up",
        "Never gonna let you down",
        "Never gonna run around and desert you",
        "Never gonna make you cry",
        "Never gonna say goodbye",
        "Never gonna tell a lie and hurt you",
    ];

    const chords = ["A", "Bb7", "Cm", "D/C#", "Em7", "Fmaj7", "G"];

    const randomChord = (): string => {
        return chords[Math.floor(Math.random() * chords.length)];
    };

    const chunk = (arr: string, tokenSize: number): string[] => {
        const tokens = tokenize(arr);
        const results: string[] = [];

        for (let i = 0; i < tokens.length; i += tokenSize) {
            const subArr = tokens.slice(i, i + tokenSize);
            results.push(subArr.join(""));
        }

        return results;
    };

    const assembleSong = (): ChordSong => {
        const chordLines: ChordLine[] = lyrics.map((lyricLine: string) =>
            assembleLine(lyricLine)
        );

        return new ChordSong(chordLines);
    };

    const assembleLine = (lyrics: string): ChordLine => {
        const lyricChunks = chunk(lyrics, 4);

        const chordBlocks: ChordBlock[] = lyricChunks.map(
            (lyricChunk: string) => {
                return new ChordBlock({
                    chord: randomChord(),
                    lyric: lyricChunk,
                });
            }
        );

        return new ChordLine(chordBlocks);
    };

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <Grid container justify="center">
                    <Grid item>
                        <ChordPaper initialSong={assembleSong()} />
                    </Grid>
                </Grid>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;