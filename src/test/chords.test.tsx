import React from "react";
import { render, cleanup, fireEvent, within } from "@testing-library/react";

import { ThemeProvider, createMuiTheme } from "@material-ui/core";

import {
    getExpectChordAndLyric,
    getFindByTestIdChain,
    FindByTestIdChainFn,
    ExpectChordAndLyricFn,
} from "./matcher";
import { enterKey } from "./userEvent";
import ChordPaper from "../components/ChordPaper";
import { SnackbarProvider } from "notistack";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { ChordBlock } from "../common/ChordModel/ChordBlock";

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
        <SnackbarProvider>
            <ChordPaper initialSong={song()} />
        </SnackbarProvider>
    </ThemeProvider>
);

describe("Rendering initial chords", () => {
    test("renders the chords", async () => {
        const { findByTestId } = render(basicChordPaper());
        const expectChordAndLyric = getExpectChordAndLyric(findByTestId);

        await expectChordAndLyric("C", "Fly me ", [
            "Line-0",
            "NoneditableLine",
            "Block-0",
        ]);

        await expectChordAndLyric("D", "to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);

        await expectChordAndLyric("", "And let me play ", [
            "Line-1",
            "NoneditableLine",
            "Block-0",
        ]);

        await expectChordAndLyric("E", "among the stars", [
            "Line-1",
            "NoneditableLine",
            "Block-1",
        ]);
    });
});

describe("Changing the chord", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;
    beforeEach(async () => {
        const { findByTestId } = render(basicChordPaper());
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findByTestId);
        const chordSymbol = await findByTestIdChain(
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "TokenBox-0",
            "ChordEditButton"
        );

        expect(chordSymbol).toBeInTheDocument();
        fireEvent.click(chordSymbol);
    });

    test("it takes input and retains new chord changes", async () => {
        const chordEdit = async () =>
            await findByTestIdChain(
                "Line-0",
                "NoneditableLine",
                "Block-1",
                "ChordEdit",
                "InnerInput"
            );

        fireEvent.change(await chordEdit(), {
            target: { value: "F7" },
        });
        enterKey(await chordEdit());

        await expectChordAndLyric("F7", "to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);
    });

    test("it gets merged with previous block when chords are cleared", async () => {
        const chordEdit = await findByTestIdChain(
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "ChordEdit",
            "InnerInput"
        );

        fireEvent.change(chordEdit, {
            target: { value: "" },
        });

        enterKey(chordEdit);

        expectChordAndLyric("C", "Fly me to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-0",
        ]);
    });
});

describe("inserting a chord", () => {
    let chordEdit: () => Promise<HTMLElement>;

    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;

    beforeEach(async () => {
        const { findByTestId } = render(basicChordPaper());
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findByTestId);

        const editButton = await findByTestIdChain(
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "TokenBox-2",
            "ChordEditButton"
        );

        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);

        chordEdit = async () =>
            await findByTestIdChain(
                "Line-0",
                "NoneditableLine",
                "Block-2", // the block should be split, so the chord happens on the next block
                "ChordEdit",
                "InnerInput"
            );
    });

    test("it splits the block", async () => {
        fireEvent.change(await chordEdit(), {
            target: { value: "Am7" },
        });

        enterKey(await chordEdit());

        await expectChordAndLyric("D", "to ", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);

        await expectChordAndLyric("Am7", "the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-2",
        ]);
    });

    test("it makes no changes if no input after all", async () => {
        fireEvent.change(await chordEdit(), {
            target: { value: "" },
        });

        enterKey(await chordEdit());

        await expectChordAndLyric("D", "to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);
    });
});
