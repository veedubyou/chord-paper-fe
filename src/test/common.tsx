import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { Lyric } from "../common/ChordModel/Lyric";
import ChordPaper from "../components/edit/ChordPaper";
import { UserContext } from "../components/user/userContext";
import { withSongContext } from "../components/WithSongContext";

const Song = withSongContext(ChordPaper);

export const withProviders = (children: React.ReactNode) => {
    return (
        <UserContext.Provider value={null}>
            <HelmetProvider>
                <ThemeProvider theme={createMuiTheme()}>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </ThemeProvider>
            </HelmetProvider>
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
