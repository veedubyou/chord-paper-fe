import React from "react";
import {
    Paper,
    Theme,
    withStyles,
    ThemeProvider,
    createMuiTheme,
    PaletteColorOptions,
} from "@material-ui/core";
import ChordPaper from "./components/ChordPaper";
import { tokenize } from "./utils/util";
import { ChordSong, ChordLine, ChordBlock } from "./common/ChordLyric";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        minHeight: "750px",
        width: "max-content",
    },
}))(Paper);

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

    const chords = ["A", "B7", "Cm", "D/C", "E7", "Fmaj7", "G"];

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

    const song = assembleSong();

    return (
        <ThemeProvider theme={theme}>
            <RootPaper elevation={3}>
                <ChordPaper initialSong={song} />
            </RootPaper>
        </ThemeProvider>
    );
}

export default App;
