import {
    cleanup,
    fireEvent,
    Matcher,
    render,
    waitForElementToBeRemoved
} from "@testing-library/react";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Lyric } from "common/ChordModel/Lyric";
import { chordPaperFromLyrics, chordPaperFromSong } from "test/common";
import {
    ExpectChordAndLyricFn,
    FindByTestIdChainFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
    lyricsInElement,
    matchLyric
} from "test/matcher";
import { changeContentEditableText, Keys, pressKey } from "test/userEvent";

afterEach(cleanup);

const lyrics: string[] = [
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around",
    //"And desert you"
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie",
    //"And hurt you"
];

const basicChordPaper = () => {
    return chordPaperFromLyrics(lyrics);
};

const getFindAllByTestId = (chordSong: ChordSong) => {
    return render(chordPaperFromSong(chordSong)).findAllByTestId;
};

describe("Rendering initial lyrics", () => {
    test("renders all initial lyric lines", async () => {
        const { findByText } = render(basicChordPaper());

        for (const lyric of lyrics) {
            const lineElement: HTMLElement = await findByText(
                matchLyric(lyric)
            );
            expect(lineElement).toBeInTheDocument();
        }
    });

    test("doesn't render an unspecified lyric line", () => {
        const { queryByText } = render(basicChordPaper());

        const lineElement: HTMLElement | null = queryByText(
            matchLyric("And hurt you")
        );
        expect(lineElement).toBeNull();
    });
});

describe("Plain text edit action", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let asyncExpectChordAndLyric: ExpectChordAndLyricFn;

    const clickFirstLine = async () => {
        const line = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0]
        );
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);
        fireEvent.click(line);
    };

    const changeLyric = async (newLyric: string) => {
        const findContentEditableElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain(
                ["Line", 0],
                ["LyricInput", 0],
                ["InnerInput", 0]
            );
        };

        expect(await findContentEditableElem()).toBeInTheDocument();
        changeContentEditableText(await findContentEditableElem(), newLyric);
        pressKey(await findContentEditableElem(), Keys.enter);
    };

    describe("From an empty song", () => {
        beforeEach(async () => {
            const song = new ChordSong({});

            const findByTestId = getFindAllByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await asyncExpectChordAndLyric("", "Never Gonna Give You Up", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);
        });
    });

    describe("Starting with some lyrics", () => {
        beforeEach(async () => {
            const song = ChordSong.fromLyricsLines([
                new Lyric("We've known each other for so long"),
            ]);

            const findByTestId = getFindAllByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await asyncExpectChordAndLyric("", "Never Gonna Give You Up", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);
        });
    });
});

describe("Tab spacing", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let asyncExpectChordAndLyric: ExpectChordAndLyricFn;

    beforeEach(async () => {
        const song = ChordSong.fromLyricsLines([
            new Lyric("Put some old bay on it and now it's a crab claw"),
        ]);

        const findByTestId = getFindAllByTestId(song);
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);
    });

    const clickFirstLine = async () => {
        const line = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0]
        );
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);
        fireEvent.click(line);
    };

    const contentEditableElem = async (): Promise<HTMLElement> => {
        return findByTestIdChain(
            ["Line", 0],
            ["LyricInput", 0],
            ["InnerInput", 0]
        );
    };

    describe("simple insertion", () => {
        const testTab = (
            expectedLyrics: string,
            action: (elem: Element) => void
        ) => {
            beforeEach(async () => {
                await clickFirstLine();
            });

            test("inserting a tab", async () => {
                expect(await contentEditableElem()).toBeInTheDocument();
                action(await contentEditableElem());
                pressKey(await contentEditableElem(), Keys.enter);

                await asyncExpectChordAndLyric("", expectedLyrics, [
                    ["Line", 0],
                    ["NoneditableLine", 0],
                    ["Block", 0],
                ]);
            });
        };

        describe("small tab", () => {
            const tabAction = (elem: Element) =>
                pressKey(elem, Keys.space, { shiftKey: true });

            testTab(
                "Put some old bay on it and now it's a crab claw\ue100",
                tabAction
            );
        });

        describe("medium tab", () => {
            const tabAction = (elem: Element) => pressKey(elem, Keys.tab);

            testTab(
                "Put some old bay on it and now it's a crab claw\ue200",
                tabAction
            );
        });

        describe("large tab", () => {
            const tabAction = (elem: Element) =>
                pressKey(elem, Keys.tab, { shiftKey: true });

            testTab(
                "Put some old bay on it and now it's a crab claw\ue400",
                tabAction
            );
        });
    });

    describe("backspacing a tab", () => {
        test("inserting a tab and then backspacing again removes the tab", async () => {
            const insertTab = async () => {
                await clickFirstLine();
                expect(await contentEditableElem()).toBeInTheDocument();
                pressKey(await contentEditableElem(), Keys.tab);
                pressKey(await contentEditableElem(), Keys.enter);
            };

            const backspaceTab = async () => {
                await clickFirstLine();
                expect(await contentEditableElem()).toBeInTheDocument();
                pressKey(await contentEditableElem(), Keys.backspace);
                pressKey(await contentEditableElem(), Keys.enter);
            };

            await insertTab();
            await asyncExpectChordAndLyric(
                "",
                "Put some old bay on it and now it's a crab claw\ue200",
                [
                    ["Line", 0],
                    ["NoneditableLine", 0],
                    ["Block", 0],
                ]
            );

            await backspaceTab();
            await asyncExpectChordAndLyric(
                "",
                "Put some old bay on it and now it's a crab claw",
                [
                    ["Line", 0],
                    ["NoneditableLine", 0],
                    ["Block", 0],
                ]
            );
        });
    });

    test("navigating around tabs", async () => {
        const insertTab = async () => {
            await clickFirstLine();
            expect(await contentEditableElem()).toBeInTheDocument();
            pressKey(await contentEditableElem(), Keys.tab);
        };

        await insertTab();
        // expect that there is 1 text node and 1 tab node
        expect((await contentEditableElem()).childNodes.length).toEqual(2);

        const selection = document.getSelection();
        if (selection === null) {
            throw new Error("selection can't be null");
        }

        const beforeNavigationRange = selection.getRangeAt(0);
        expect(beforeNavigationRange.startContainer).toEqual(
            await contentEditableElem()
        );
        expect(beforeNavigationRange.endContainer).toEqual(
            await contentEditableElem()
        );

        expect(beforeNavigationRange.startOffset).toEqual(2);
        expect(beforeNavigationRange.endOffset).toEqual(2);

        pressKey(await contentEditableElem(), Keys.left);

        const afterLeftNavigationRange = selection.getRangeAt(0);
        expect(afterLeftNavigationRange.startContainer).toEqual(
            await contentEditableElem()
        );
        expect(afterLeftNavigationRange.endContainer).toEqual(
            await contentEditableElem()
        );

        expect(afterLeftNavigationRange.startOffset).toEqual(1);
        expect(afterLeftNavigationRange.endOffset).toEqual(1);

        pressKey(await contentEditableElem(), Keys.right);

        const afterRightNavigationRange = selection.getRangeAt(0);
        expect(afterRightNavigationRange.startContainer).toEqual(
            await contentEditableElem()
        );
        expect(afterRightNavigationRange.endContainer).toEqual(
            await contentEditableElem()
        );

        expect(afterRightNavigationRange.startOffset).toEqual(2);
        expect(afterRightNavigationRange.endOffset).toEqual(2);
    });
});

describe("Edit action with chords", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;
    beforeEach(async () => {
        const song = new ChordSong({
            lines: [
                new ChordLine({
                    blocks: [
                        new ChordBlock({
                            chord: "F",
                            lyric: new Lyric("It's your fault "),
                        }),
                        new ChordBlock({
                            chord: "C",
                            lyric: new Lyric("that I'm in trouble"),
                        }),
                    ],
                }),
            ],
        });

        const findByTestId = getFindAllByTestId(song);
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findByTestId);

        const line = await findByTestIdChain(
            ["Line", 0],
            ["NoneditableLine", 0]
        );
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        fireEvent.click(line);
    });

    const changeLyric = async (newLyric: string) => {
        const findInputElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain(
                ["Line", 0],
                ["LyricInput", 0],
                ["InnerInput", 0]
            );
        };

        expect(await findInputElem()).toBeInTheDocument();

        changeContentEditableText(await findInputElem(), newLyric);

        pressKey(await findInputElem(), Keys.enter);
    };

    describe("no op", () => {
        test("it doesn't change anything", async () => {
            await changeLyric("It's your fault that I'm in trouble");

            await expectChordAndLyric("F", "It's your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });
    });

    describe("mixed operations", () => {
        test("replacing a word at the beginning of the block", async () => {
            await changeLyric("It's your fault so I'm in trouble");

            await expectChordAndLyric("F", "It's your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "so I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("insertions deletions and replacements everywhere", async () => {
            await changeLyric("Not really my fault that I am trooble");

            await expectChordAndLyric("F", "Not really my fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I am trooble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });
    });

    describe("insertion", () => {
        test("adding a word in the middle of the block", async () => {
            await changeLyric("It's really your fault that I'm in trouble");

            await expectChordAndLyric("F", "It's really your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("adding a word in the end of the block", async () => {
            await changeLyric("It's your fault really that I'm in trouble");

            await expectChordAndLyric("F", "It's your fault really ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("adding a word in the beginning of the line", async () => {
            await changeLyric("Verse: It's your fault that I'm in trouble");

            await expectChordAndLyric("", "Verse: ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("F", "It's your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 2],
            ]);
        });
    });

    describe("removal", () => {
        test("removing a word from the middle", async () => {
            await changeLyric("It's your that I'm in trouble");

            await expectChordAndLyric("F", "It's your ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("removing a word from the end", async () => {
            await changeLyric("It's your fault that I'm in");

            await expectChordAndLyric("F", "It's your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("removing a word from the beginning", async () => {
            await changeLyric("your fault that I'm in trouble");

            await expectChordAndLyric("F", "your fault ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("removing random characters everywhere", async () => {
            await changeLyric("It your fut hat I'm trouble");

            await expectChordAndLyric("F", "It your fut ", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "hat I'm trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("removing the first block, causing it to be replaced with a tab", async () => {
            await changeLyric("that I'm in trouble");

            await expectChordAndLyric("F", "\ue100", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });

        test("removing the second block, causing it to be replaced with a tab", async () => {
            await changeLyric("It's your fault");

            await expectChordAndLyric("F", "It's your fault", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 0],
            ]);

            await expectChordAndLyric("C", "\ue100", [
                ["Line", 0],
                ["NoneditableLine", 0],
                ["Block", 1],
            ]);
        });
    });
});

describe("Add action", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let subject: () => Promise<void>;

    beforeEach(async () => {
        const { findAllByTestId } = render(basicChordPaper());

        findByTestIdChain = getFindByTestIdChain(findAllByTestId);

        const line = await findByTestIdChain(["NewLine", 2]);
        expect(line).toBeInTheDocument();

        subject = async () => {
            fireEvent.mouseOver(line);
            const addButton = (await findAllByTestId("AddButton"))[0];
            expect(addButton).toBeInTheDocument();
            fireEvent.click(addButton);
        };
    });

    it("adds a new empty line", async () => {
        await subject();
        const newLine = await findByTestIdChain(
            ["Line", 3],
            ["NoneditableLine", 0]
        );
        expect(newLine).toBeInTheDocument();
        expect(newLine).toHaveTextContent("", { normalizeWhitespace: true });
    });

    it("pushes the next line down", async () => {
        await subject();
        const pushedLine = await findByTestIdChain(
            ["Line", 4],
            ["NoneditableLine", 0]
        );
        expect(pushedLine).toBeInTheDocument();

        const lyrics = lyricsInElement(pushedLine);
        expect(lyrics).toEqual("Never gonna make you cry");
    });
});

describe("Remove action", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let queryByText: (matcher: Matcher) => HTMLElement | null;

    let subject: () => Promise<void>;

    beforeEach(async () => {
        const rendered = render(basicChordPaper());
        queryByText = rendered.queryByText;

        findByTestIdChain = getFindByTestIdChain(rendered.findAllByTestId);

        const line = await findByTestIdChain(
            ["Line", 2],
            ["NoneditableLine", 0]
        );
        expect(line).toBeInTheDocument();

        const lyrics = lyricsInElement(line);
        expect(lyrics).toEqual("Never gonna run around");

        subject = async () => {
            fireEvent.mouseOver(line);
            const removeButton = await findByTestIdChain(["RemoveButton", 0]);
            expect(removeButton).toBeInTheDocument();
            fireEvent.click(removeButton);
        };
    });

    it("removes the line", async () => {
        await subject();
        await waitForElementToBeRemoved(() =>
            queryByText(matchLyric("Never gonna run around"))
        );
    });

    it("shifts the next line up", async () => {
        await subject();
        await waitForElementToBeRemoved(() =>
            queryByText(matchLyric("Never gonna run around"))
        );

        const line = await findByTestIdChain(
            ["Line", 2],
            ["NoneditableLine", 0]
        );
        const lyrics = lyricsInElement(line);
        expect(lyrics).toEqual("Never gonna make you cry");
    });
});
