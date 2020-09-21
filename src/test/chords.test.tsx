import { cleanup, fireEvent, render } from "@testing-library/react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { Lyric } from "../common/ChordModel/Lyric";
import { chordPaperFromSong } from "./common";
import {
    ExpectChordAndLyricFn,
    FindByTestIdChainFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
} from "./matcher";
import { changeInputText, enterKey } from "./userEvent";

afterEach(cleanup);

const song = (): ChordSong => {
    const lines: ChordLine[] = [
        new ChordLine([
            new ChordBlock({ chord: "C", lyric: new Lyric("Fly me ") }),
            new ChordBlock({ chord: "D", lyric: new Lyric("to the moon") }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: new Lyric("And let me play ") }),
            new ChordBlock({ chord: "E", lyric: new Lyric("among the stars") }),
        ]),
    ];

    return new ChordSong(lines);
};

const basicChordPaper = () => {
    return chordPaperFromSong(song());
};

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
            "ChordSymbol"
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
                "TextInput",
                "InnerInput"
            );

        changeInputText(await chordEdit(), "F7");

        enterKey(await chordEdit());

        await expectChordAndLyric("F7", "to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);
    });

    //todo?
    test("it gets merged with previous block when chords are cleared", async () => {
        const chordEdit = await findByTestIdChain(
            "Line-0",
            "NoneditableLine",
            "Block-1",
            "ChordEdit",
            "TextInput",
            "InnerInput"
        );

        changeInputText(chordEdit, "");

        enterKey(chordEdit);

        await expectChordAndLyric("C", "Fly me to the moon", [
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
                "TextInput",
                "InnerInput"
            );
    });

    test("it splits the block", async () => {
        changeInputText(await chordEdit(), "Am7");

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
        changeInputText(await chordEdit(), "");

        enterKey(await chordEdit());

        await expectChordAndLyric("D", "to the moon", [
            "Line-0",
            "NoneditableLine",
            "Block-1",
        ]);
    });
});
