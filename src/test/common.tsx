import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { withSongContext } from "../components/WithSongContext";
import ChordPaper from "../components/edit/ChordPaper";
import { HelmetProvider } from "react-helmet-async";

const Song = withSongContext(ChordPaper);

const withProviders = (children: React.ReactNode) => {
    return (
        <HelmetProvider>
            <ThemeProvider theme={createMuiTheme()}>
                <SnackbarProvider>{children}</SnackbarProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
};

export const chordPaperFromLyrics = (lyrics: string[]) => {
    const song = ChordSong.fromLyricsLines(lyrics);

    return withProviders(<Song song={song} />);
};

export const chordPaperFromSong = (song: ChordSong) => {
    return withProviders(<Song song={song} />);
};
