import {
    cleanup,
    fireEvent,
    Matcher,
    render,
    waitForElementToBeRemoved,
} from "@testing-library/react";
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
    lyricsInElement,
    matchLyric,
} from "./matcher";
import { changeContentEditableText, enterKey, tabKey } from "./userEvent";

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

const getFindByTestId = (chordSong: ChordSong) => {
    return render(chordPaperFromSong(chordSong)).findByTestId;
};

describe("Rendering initial lyrics", () => {
    test("renders all initial lyric lines", () => {
        const { getByText } = render(basicChordPaper());

        lyrics.forEach((lyric: string) => {
            const lineElement: HTMLElement = getByText(matchLyric(lyric));
            expect(lineElement).toBeInTheDocument();
        });
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
        const line = await findByTestIdChain("Line-0", "NoneditableLine");
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);
        fireEvent.click(line);
    };

    const changeLyric = async (newLyric: string) => {
        const findContentEditableElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain("Line-0", "LyricInput", "InnerInput");
        };

        expect(await findContentEditableElem()).toBeInTheDocument();
        changeContentEditableText(await findContentEditableElem(), newLyric);
        enterKey(await findContentEditableElem());
    };

    describe("From an empty song", () => {
        beforeEach(async () => {
            const song = new ChordSong();

            const findByTestId = getFindByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await asyncExpectChordAndLyric("", "Never Gonna Give You Up", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);
        });
    });

    describe("Starting with some lyrics", () => {
        beforeEach(async () => {
            const song = ChordSong.fromLyricsLines([
                new Lyric("We've known each other for so long"),
            ]);

            const findByTestId = getFindByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await asyncExpectChordAndLyric("", "Never Gonna Give You Up", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);
        });
    });
});

    const clickFirstLine = async () => {
        const line = await findByTestIdChain("Line-0", "NoneditableLine");
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);
        fireEvent.click(line);
    };

    const testTab = (
        startingLyrics: string,
        expectedLyrics: string,
        action: (elem: Element) => void
    ) => {
        beforeEach(async () => {
            const song = ChordSong.fromLyricsLines([new Lyric(startingLyrics)]);

            const findByTestId = getFindByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            asyncExpectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting a tab", async () => {
            const findContentEditableElem = async (): Promise<HTMLElement> => {
                return findByTestIdChain("Line-0", "LyricInput", "InnerInput");
            };

            expect(await findContentEditableElem()).toBeInTheDocument();
            action(await findContentEditableElem());
            enterKey(await findContentEditableElem());

            await asyncExpectChordAndLyric("", expectedLyrics, [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);
        });
    };

    describe("size 1 tab", () => {
        const tabAction = (elem: Element) => tabKey(elem, false);

        testTab(
            "Put some old bay on it and now it's a crab claw",
            "Put some old bay on it and now it's a crab claw<⑴>",
            tabAction
        );
    });

    describe("size 2 tab", () => {
        const tabAction = (elem: Element) => tabKey(elem, true);

        testTab(
            "Put some old bay on it and now it's a crab claw",
            "Put some old bay on it and now it's a crab claw<⑵>",
            tabAction
        );
    });
});

describe("Edit action with chords", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;
    beforeEach(async () => {
        const song = new ChordSong([
            new ChordLine([
                new ChordBlock({
                    chord: "F",
                    lyric: new Lyric("It's your fault "),
                }),
                new ChordBlock({
                    chord: "C",
                    lyric: new Lyric("that I'm in trouble"),
                }),
            ]),
        ]);

        const findByTestId = getFindByTestId(song);
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findByTestId);

        const line = await findByTestIdChain("Line-0", "NoneditableLine");
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        fireEvent.click(line);
    });

    const changeLyric = async (newLyric: string) => {
        const findInputElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain("Line-0", "LyricInput", "InnerInput");
        };

        expect(await findInputElem()).toBeInTheDocument();

        changeContentEditableText(await findInputElem(), newLyric);

        enterKey(await findInputElem());
    };

    describe("no op", () => {
        test("it doesn't change anything", async () => {
            await changeLyric("It's your fault that I'm in trouble");

            await expectChordAndLyric("F", "It's your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });
    });

    describe("mixed operations", () => {
        test("replacing a word at the beginning of the block", async () => {
            await changeLyric("It's your fault so I'm in trouble");

            await expectChordAndLyric("F", "It's your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "so I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("insertions deletions and replacements everywhere", async () => {
            await changeLyric("Not really my fault that I am trooble");

            await expectChordAndLyric("F", "Not really my fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I am trooble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });
    });

    describe("insertion", () => {
        test("adding a word in the middle of the block", async () => {
            await changeLyric("It's really your fault that I'm in trouble");

            await expectChordAndLyric("F", "It's really your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("adding a word in the end of the block", async () => {
            await changeLyric("It's your fault really that I'm in trouble");

            await expectChordAndLyric("F", "It's your fault really ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("adding a word in the beginning of the line", async () => {
            await changeLyric("Verse: It's your fault that I'm in trouble");

            await expectChordAndLyric("", "Verse: ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("F", "It's your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-2",
            ]);
        });
    });

    describe("removal", () => {
        test("removing a word from the middle", async () => {
            await changeLyric("It's your that I'm in trouble");

            await expectChordAndLyric("F", "It's your ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("removing a word from the end", async () => {
            await changeLyric("It's your fault that I'm in");

            await expectChordAndLyric("F", "It's your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("removing a word from the beginning", async () => {
            await changeLyric("your fault that I'm in trouble");

            await expectChordAndLyric("F", "your fault ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("removing random characters everywhere", async () => {
            await changeLyric("It your fut hat I'm trouble");

            await expectChordAndLyric("F", "It your fut ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "hat I'm trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("removing the first block, causing it to be replaced with a space", async () => {
            await changeLyric("that I'm in trouble");

            await expectChordAndLyric("F", " ", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", "that I'm in trouble", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });

        test("removing the second block, causing it to steal a space from the first", async () => {
            await changeLyric("It's your fault");

            await expectChordAndLyric("F", "It's your fault", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("C", " ", [
                "Line-0",
                "NoneditableLine",
                "Block-1",
            ]);
        });
    });
});

describe("Add action", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let subject: () => Promise<void>;

    beforeEach(async () => {
        const { findByTestId } = render(basicChordPaper());

        findByTestIdChain = getFindByTestIdChain(findByTestId);

        const line = await findByTestIdChain("NewLine-2");
        expect(line).toBeInTheDocument();

        subject = async () => {
            fireEvent.mouseOver(line);
            const addButton = await findByTestId("AddButton");
            expect(addButton).toBeInTheDocument();
            fireEvent.click(addButton);
        };
    });

    it("adds a new empty line", async () => {
        await subject();
        const newLine = await findByTestIdChain("Line-3", "NoneditableLine");
        expect(newLine).toBeInTheDocument();
        expect(newLine).toHaveTextContent("", { normalizeWhitespace: true });
    });

    it("pushes the next line down", async () => {
        await subject();
        const pushedLine = await findByTestIdChain("Line-4", "NoneditableLine");
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

        findByTestIdChain = getFindByTestIdChain(rendered.findByTestId);

        const line = await findByTestIdChain("Line-2", "NoneditableLine");
        expect(line).toBeInTheDocument();

        const lyrics = lyricsInElement(line);
        expect(lyrics).toEqual("Never gonna run around");

        subject = async () => {
            fireEvent.mouseOver(line);
            const removeButton = await findByTestIdChain("RemoveButton");
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

        const line = await findByTestIdChain("Line-2", "NoneditableLine");
        const lyrics = lyricsInElement(line);
        expect(lyrics).toEqual("Never gonna make you cry");
    });
});
