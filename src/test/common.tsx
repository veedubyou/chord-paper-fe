import React from "react";
import {
    render,
    fireEvent,
    waitForElementToBeRemoved,
    cleanup,
    Matcher,
    act,
} from "@testing-library/react";

import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import {
    matchLyric,
    lyricsInElement,
    FindByTestIdChainFn,
    ExpectChordAndLyricFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
} from "./matcher";
import { enterKey } from "./userEvent";
import ChordPaper from "../components/edit/ChordPaper";
import { SnackbarProvider } from "notistack";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { ChordBlock } from "../common/ChordModel/ChordBlock";

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
