import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { withSongContext } from "../components/WithSongContext";
import ChordPaper from "../components/edit/ChordPaper";
import { HelmetProvider } from "react-helmet-async";

const Song = withSongContext(ChordPaper);

export const withProviders = (children: React.ReactNode) => {
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

export const selectionStub = () => {
    //https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
    global.document.createRange = (): Range => ({
        setStart: () => {},
        setEnd: () => {},
        //@ts-ignore
        commonAncestorContainer: {
            nodeName: "BODY",
            ownerDocument: document,
        },
        selectNodeContents: () => {},
        collapse: () => {},
    });

    global.window.getSelection = () => null;
};

export const gapiStub = () => {
    global.window["gapi"] = {
        load: jest.fn(),
        auth: {} as any,
        client: {} as any,
        signin2: {} as any,
        auth2: {
            init: jest.fn(),
            getAuthInstance: jest.fn(),
            GoogleAuth: {} as any,
            authorize: jest.fn(),
            SigninOptionsBuilder: {} as any,
        },
    };
};
