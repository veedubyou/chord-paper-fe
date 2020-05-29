import React from "react";
import {
    render,
    fireEvent,
    waitForElementToBeRemoved,
    cleanup,
    Matcher,
    within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ChordPaper from "../components/ChordPaper";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { ChordSong, ChordLine, ChordBlock } from "../common/ChordModels";
import { matchLyric, lyricsInElement, expectChordAndLyric } from "./matcher";

afterEach(cleanup);

beforeAll(() => {
    //https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
    global.document.createRange = () => ({
        setStart: () => {},
        setEnd: () => {},
        //@ts-ignore
        commonAncestorContainer: {
            nodeName: "BODY",
            ownerDocument: document,
        },
    });
});

const song = (): ChordSong => {
    const lines: ChordLine[] = [
        new ChordLine([
            new ChordBlock({ chord: "C", lyric: "Fly me " }),
            new ChordBlock({ chord: "D", lyric: "to the moon" }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "And let me play " }),
            new ChordBlock({ chord: "E", lyric: "among the stars" }),
        ]),
    ];

    return new ChordSong(lines);
};

const basicChordPaper = () => (
    <ThemeProvider theme={createMuiTheme()}>
        <ChordPaper initialSong={song()} />
    </ThemeProvider>
);

describe("Rendering initial chords", () => {
    test("renders the chords", async () => {
        const { findByTestId } = render(basicChordPaper());

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-0"],
            "C",
            "Fly me"
        );

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-1"],
            "D",
            "to the moon"
        );

        await expectChordAndLyric(
            findByTestId,
            ["Line-1", "NoneditableLine", "Block-0"],
            "",
            "And let me play"
        );

        await expectChordAndLyric(
            findByTestId,
            ["Line-1", "NoneditableLine", "Block-1"],
            "E",
            "among the stars"
        );
    });
});
