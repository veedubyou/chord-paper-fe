import { cleanup, fireEvent, render } from "@testing-library/react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { Lyric } from "../common/ChordModel/Lyric";
import { chordPaperFromLyrics, chordPaperFromSong } from "./common";
import {
    ExpectChordAndLyricFn,
    FindByTestIdChainFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
} from "./matcher";
import { changeInputText, Keys, pressKey } from "./userEvent";

afterEach(cleanup);

const song = (): ChordSong => {
    const lines: ChordLine[] = [
        new ChordLine({
            blocks: [
                new ChordBlock({ chord: "C", lyric: new Lyric("Fly me ") }),
                new ChordBlock({ chord: "D", lyric: new Lyric("to the moon") }),
            ],
        }),
        new ChordLine({
            blocks: [
                new ChordBlock({
                    chord: "",
                    lyric: new Lyric("And let me play "),
                }),
                new ChordBlock({
                    chord: "E",
                    lyric: new Lyric("among the stars"),
                }),
            ],
        }),
    ];

    return new ChordSong({ lines: lines });
};

const basicChordPaper = () => {
    return chordPaperFromSong(song());
};

describe("Rendering initial chords", () => {
    test("renders the chords", async () => {
        const { findAllByTestId } = render(basicChordPaper());
        const expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);

        await expectChordAndLyric("C", "Fly me ", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 0],
        ]);

        await expectChordAndLyric("D", "to the moon", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);

        await expectChordAndLyric("", "And let me play ", [
            ["Line", 1],
            ["NoneditableLine", 0],
            ["Block", 0],
        ]);

        await expectChordAndLyric("E", "among the stars", [
            ["Line", 1],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);
    });
});

describe("Changing the chord", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;
    beforeEach(async () => {
        const { findAllByTestId } = render(basicChordPaper());
        findByTestIdChain = getFindByTestIdChain(findAllByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);
        const chordSymbol = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
            ["ChordSymbol", 0]
        );

        expect(chordSymbol).toBeInTheDocument();
        fireEvent.click(chordSymbol);
    });

    test("it takes input and retains new chord changes", async () => {
        const chordEdit = async () =>
            await findByTestIdChain(
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
                ["ChordEdit", 0],
                ["TextInput", 0],
                ["InnerInput", 0]
            );

        changeInputText(await chordEdit(), "F7");

        pressKey(await chordEdit(), Keys.enter);

        await expectChordAndLyric("F7", "to the moon", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);
    });

    test("it gets merged with previous block when chords are cleared", async () => {
        const chordEdit = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
            ["ChordEdit", 0],
            ["TextInput", 0],
            ["InnerInput", 0]
        );

        changeInputText(chordEdit, "");

        pressKey(chordEdit, Keys.enter);

        await expectChordAndLyric("C", "Fly me to the moon", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 0],
        ]);
    });
});

describe("inserting a chord", () => {
    let chordEdit: () => Promise<HTMLElement>;

    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;

    beforeEach(async () => {
        const { findAllByTestId } = render(basicChordPaper());
        findByTestIdChain = getFindByTestIdChain(findAllByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);

        const editButton = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
            ["TokenBox-2", 0],
            ["ChordEditButton", 0]
        );

        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);

        chordEdit = async () =>
            await findByTestIdChain(
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 2], // the block should be split, so the chord happens on the next block
                ["ChordEdit", 0],
                ["TextInput", 0],
                ["InnerInput", 0]
            );
    });

    test("it splits the block", async () => {
        changeInputText(await chordEdit(), "Am7");

        pressKey(await chordEdit(), Keys.enter);

        await expectChordAndLyric("D", "to ", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);

        await expectChordAndLyric("Am7", "the moon", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 2],
        ]);
    });

    test("it makes no changes if no input after all", async () => {
        changeInputText(await chordEdit(), "");

        pressKey(await chordEdit(), Keys.enter);

        await expectChordAndLyric("D", "to the moon", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);
    });
});

describe("inserting a chord at a tab block", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;

    beforeEach(async () => {
        const { findAllByTestId } = render(
            chordPaperFromLyrics([
                "I\ue200never loved you fully in the way I could",
            ])
        );
        findByTestIdChain = getFindByTestIdChain(findAllByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);
    });

    test("it inserts the chord at the tab space and treats it as an atomic token", async () => {
        const insertChordAtTab = async () => {
            const editButton = await findByTestIdChain(
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
                ["TokenBox-1", 0],
                ["ChordEditButton", 0]
            );

            expect(editButton).toBeInTheDocument();
            fireEvent.click(editButton);

            const chordEdit = async () =>
                await findByTestIdChain(
                    ["Line", 0],
                    ["NoneditableLine", 0],
                    ["Block", 1], // the block should be split, so the chord happens on the next block
                    ["ChordEdit", 0],
                    ["TextInput", 0],
                    ["InnerInput", 0]
                );
            changeInputText(await chordEdit(), "Am7");
            pressKey(await chordEdit(), Keys.enter);
        };

        const insertChordAtLyricAfterTab = async () => {
            const editButton = await findByTestIdChain(
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
                ["TokenBox-1", 0],
                ["ChordEditButton", 0]
            );

            expect(editButton).toBeInTheDocument();
            fireEvent.click(editButton);

            const chordEdit = async () =>
                await findByTestIdChain(
                    ["Line", 0],
                    ["NoneditableLine", 0],
                    ["Block", 2], // the block should be split, so the chord happens on the next block
                    ["ChordEdit", 0],
                    ["TextInput", 0],
                    ["InnerInput", 0]
                );
            changeInputText(await chordEdit(), "D");
            pressKey(await chordEdit(), Keys.enter);
        };

        await insertChordAtTab();
        await insertChordAtLyricAfterTab();

        await expectChordAndLyric("", "I", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 0],
        ]);

        await expectChordAndLyric("Am7", "\ue200", [
            ["Line", 0],
            ["NoneditableLine", 0],
            ["Block", 1],
        ]);

        await expectChordAndLyric(
            "D",
            "never loved you fully in the way I could",
            [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 2],
            ]
        );
    });
});
