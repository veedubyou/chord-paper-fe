import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { HashRouter } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { Lyric } from "../common/ChordModel/Lyric";
import { noopFn } from "../common/PlainFn";
import ChordPaper from "../components/edit/ChordPaper";
import DragAndDrop from "../components/edit/DragAndDrop";
import { SetUserContext, UserContext } from "../components/user/userContext";
import { withSongContext } from "../components/WithSongContext";

const Song = withSongContext(ChordPaper);

export const withProviders = (children: React.ReactNode) => {
    return (
        <UserContext.Provider value={null}>
            <SetUserContext.Provider value={noopFn}>
                <HelmetProvider>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={createTheme()}>
                            <HashRouter>
                                <DragAndDrop>
                                    <SnackbarProvider>{children}</SnackbarProvider>
                                </DragAndDrop>
                            </HashRouter>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </HelmetProvider>
            </SetUserContext.Provider>
        </UserContext.Provider>
    );
};

export const chordPaperFromLyrics = (lyrics: string[]) => {
    const serializedLyrics = lyrics.map((line: string) => new Lyric(line));
    const song = ChordSong.fromLyricsLines(serializedLyrics);

    return withProviders(<Song song={song} />);
};

export const chordPaperFromSong = (song: ChordSong) => {
    return withProviders(<Song song={song} />);
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
