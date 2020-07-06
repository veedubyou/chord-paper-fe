import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ChordPaper from "../components/edit/ChordPaper";

export const chordPaperFromLyrics = (lyrics: string[]) => {
    const song = ChordSong.fromLyricsLines(lyrics);

    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <ChordPaper initialSong={song} />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export const chordPaperFromSong = (song: ChordSong) => {
    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <ChordPaper initialSong={song} />
            </SnackbarProvider>
        </ThemeProvider>
    );
};
