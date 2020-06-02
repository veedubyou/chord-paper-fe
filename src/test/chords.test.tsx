import React from "react";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ChordPaperBody from "../components/ChordPaperBody";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { ChordSong, ChordLine, ChordBlock } from "../common/ChordModel";
import { expectChordAndLyric, findByTestIdChain } from "./matcher";
import { enterKey } from "./userEvent";

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
        <ChordPaperBody song={song()} />
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

describe("Changing the chord", () => {
    let findByTestId: (testID: string) => Promise<HTMLElement>;
    beforeEach(async () => {
        findByTestId = render(basicChordPaper()).findByTestId;
        const token = await findByTestIdChain(findByTestId, [
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "Token-0",
        ]);
        userEvent.click(token);
    });

    test("it takes input and retains new chord changes", async () => {
        const chordEdit = await findByTestIdChain(findByTestId, [
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "ChordEdit",
            "InnerInput",
        ]);

        fireEvent.change(chordEdit, {
            target: { value: "F7" },
        });
        enterKey(chordEdit);

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-1"],
            "F7",
            "to the moon"
        );
    });

    test("it gets merged with previous block when chords are cleared", async () => {
        const chordEdit = await findByTestIdChain(findByTestId, [
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "ChordEdit",
            "InnerInput",
        ]);

        fireEvent.change(chordEdit, {
            target: { value: "" },
        });

        enterKey(chordEdit);

        expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-0"],
            "C",
            "Fly me to the moon"
        );
    });
});

describe("inserting a chord", () => {
    let findByTestId: (testID: string) => Promise<HTMLElement>;
    let chordEdit: HTMLElement;

    beforeEach(async () => {
        findByTestId = render(basicChordPaper()).findByTestId;

        const token = await findByTestIdChain(findByTestId, [
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "Token-2",
        ]);
        userEvent.click(token);

        chordEdit = await findByTestIdChain(findByTestId, [
            "Line-0",
            "NoneditableLine",
            "Block-2", // the block should be split, so the chord happens on the next block
            "ChordEdit",
            "InnerInput",
        ]);
    });

    test("it splits the block", async () => {
        fireEvent.change(chordEdit, {
            target: { value: "Am7" },
        });

        enterKey(chordEdit);

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-1"],
            "D",
            "to"
        );

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-2"],
            "Am7",
            "the moon"
        );
    });

    test("it makes no changes if no input after all", async () => {
        fireEvent.change(chordEdit, {
            target: { value: "" },
        });

        enterKey(chordEdit);

        await expectChordAndLyric(
            findByTestId,
            ["Line-0", "NoneditableLine", "Block-1"],
            "D",
            "to the moon"
        );
    });
});
