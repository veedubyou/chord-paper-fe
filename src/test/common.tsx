import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import Song, { SongMode } from "../components/Song";

export const chordPaperFromLyrics = (lyrics: string[]) => {
    const song = ChordSong.fromLyricsLines(lyrics);

    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <Song initialSong={song} mode={SongMode.Edit} />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export const chordPaperFromSong = (song: ChordSong) => {
    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <Song initialSong={song} mode={SongMode.Edit} />
            </SnackbarProvider>
        </ThemeProvider>
    );
};
