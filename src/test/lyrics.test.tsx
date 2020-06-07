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

const chordPaperFromLyrics = (lyrics: string[]) => {
    const song = ChordSong.fromLyricsLines(lyrics);

    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <ChordPaper initialSong={song} />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

const chordPaperFromSong = (song: ChordSong) => {
    return (
        <ThemeProvider theme={createMuiTheme()}>
            <SnackbarProvider>
                <ChordPaper initialSong={song} />
            </SnackbarProvider>
        </ThemeProvider>
    );
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

describe("Hover Menu", () => {
    describe("Buttons show on hover", () => {
        let findByTestIdChain: FindByTestIdChainFn;
        let subject: () => void;

        beforeEach(async () => {
            const { findByTestId } = render(basicChordPaper());
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            const hoverLine = await findByTestIdChain(
                "Line-2",
                "NoneditableLine"
            );
            expect(hoverLine).toBeInTheDocument();

            subject = () => {
                fireEvent.mouseOver(hoverLine);
            };
        });

        it("shows the edit button", async () => {
            subject();
            const editButton = await findByTestIdChain("EditButton");
            expect(editButton).toBeInTheDocument();
        });

        it("shows the add button", async () => {
            subject();
            const addButton = await findByTestIdChain("AddButton");
            expect(addButton).toBeInTheDocument();
        });

        it("shows the remove button", async () => {
            subject();
            const removeButton = await findByTestIdChain("RemoveButton");
            expect(removeButton).toBeInTheDocument();
        });
    });

    describe("Buttons hide when not hovered", () => {
        let queryByTestId: (testID: string) => HTMLElement | null;
        let subject: () => void;

        beforeEach(async () => {
            const rendered = render(basicChordPaper());
            queryByTestId = rendered.queryByTestId;

            const findByTestId = rendered.findByTestId;
            const findByTestIdChain = getFindByTestIdChain(findByTestId);

            const hoverLine = await findByTestIdChain(
                "Line-2",
                "NoneditableLine"
            );
            expect(hoverLine).toBeInTheDocument();
            fireEvent.mouseOver(hoverLine);

            // need to wait for the element to appear before we can wait for the disappearance
            expect(await findByTestId("EditButton")).toBeInTheDocument();
            expect(await findByTestId("AddButton")).toBeInTheDocument();
            expect(await findByTestId("RemoveButton")).toBeInTheDocument();

            subject = () => {
                fireEvent.mouseOut(hoverLine);
            };
        });

        it("hides the edit button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("EditButton");
            });
        });

        it("hides the add button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("AddButton");
            });
        });

        it("hides the remove button", async () => {
            subject();
            await waitForElementToBeRemoved(() => {
                return queryByTestId("RemoveButton");
            });
        });
    });
});

describe("Plain text edit action", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;

    const clickFirstLine = async () => {
        const line = await findByTestIdChain("Line-0", "NoneditableLine");
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        const editButton = await findByTestIdChain("EditButton");
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
    };

    const changeLyric = async (newLyric: string) => {
        const findInputElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain("Line-0", "EditableLine", "InnerInput");
        };

        expect(await findInputElem()).toBeInTheDocument();

        fireEvent.change(await findInputElem(), {
            target: { value: newLyric },
        });

        enterKey(await findInputElem());
    };

    describe("From an empty song", () => {
        beforeEach(async () => {
            const song = new ChordSong();

            const findByTestId = getFindByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await expectChordAndLyric("", "Never Gonna Give You Up", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);
        });
    });

    describe("Starting with some lyrics", () => {
        beforeEach(async () => {
            const song = ChordSong.fromLyricsLines([
                "We've known each other for so long",
            ]);

            const findByTestId = getFindByTestId(song);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await clickFirstLine();
        });

        test("inserting new lyrics", async () => {
            await changeLyric("Never Gonna Give You Up");

            await expectChordAndLyric("", "Never Gonna Give You Up", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);
        });
    });
});

describe("Edit action with chords", () => {
    let findByTestIdChain: FindByTestIdChainFn;
    let expectChordAndLyric: ExpectChordAndLyricFn;
    beforeEach(async () => {
        const song = new ChordSong([
            new ChordLine([
                new ChordBlock({ chord: "F", lyric: "It's your fault " }),
                new ChordBlock({ chord: "C", lyric: "that I'm in trouble" }),
            ]),
        ]);

        const findByTestId = getFindByTestId(song);
        findByTestIdChain = getFindByTestIdChain(findByTestId);
        expectChordAndLyric = getExpectChordAndLyric(findByTestId);

        const line = await findByTestIdChain("Line-0", "NoneditableLine");
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        const editButton = await findByTestIdChain("EditButton");
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
    });

    const changeLyric = async (newLyric: string) => {
        const findInputElem = async (): Promise<HTMLElement> => {
            return findByTestIdChain("Line-0", "EditableLine", "InnerInput");
        };

        expect(await findInputElem()).toBeInTheDocument();

        fireEvent.change(await findInputElem(), {
            target: { value: newLyric },
        });

        enterKey(await findInputElem());
    };

    describe("no op", () => {
        test("it doesn't change anything", async () => {
            await changeLyric("It's your fault that I'm in trouble");

            await expectChordAndLyric("F", "It's your fault", [
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

            await expectChordAndLyric("F", "It's your fault", [
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

            await expectChordAndLyric("F", "Not really my fault", [
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

            await expectChordAndLyric("F", "It's really your fault", [
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

            await expectChordAndLyric("F", "It's your fault really", [
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

            await expectChordAndLyric("", "Verse:", [
                "Line-0",
                "NoneditableLine",
                "Block-0",
            ]);

            await expectChordAndLyric("F", "It's your fault", [
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

            await expectChordAndLyric("F", "It's your", [
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

            await expectChordAndLyric("F", "It's your fault", [
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

            await expectChordAndLyric("F", "your fault", [
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

            await expectChordAndLyric("F", "It your fut", [
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

        const line = await findByTestIdChain("Line-2", "NoneditableLine");
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

        expect(line).toHaveTextContent("Never gonna run around");

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
        expect(line).toHaveTextContent("Never gonna make you cry");
    });
});

describe("Pasting Lyrics", () => {
    const pasteEvent = (textContent: string[]): Event => {
        const event = new Event("paste", {
            bubbles: true,
            cancelable: true,
            composed: true,
        });

        //@ts-ignore
        event["clipboardData"] = {
            getData: (pasteType: string) => textContent.join("\n"),
        };

        return event;
    };

    const startEdit = async (
        findByTestIdChain: FindByTestIdChainFn,
        ...testIDPath: string[]
    ) => {
        const line = await findByTestIdChain(...testIDPath);
        expect(line).toBeInTheDocument();
        fireEvent.mouseOver(line);

        const editButton = await findByTestIdChain("EditButton");
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
    };

    describe("into an empty line", () => {
        let findByTestIdChain: FindByTestIdChainFn;
        let expectChordAndLyric: ExpectChordAndLyricFn;

        beforeEach(async () => {
            const chordPaper = chordPaperFromLyrics(["", "123"]);
            const { findByTestId } = render(chordPaper);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await startEdit(findByTestIdChain, "Line-0", "NoneditableLine");
        });

        describe("pasting multiple lines", () => {
            beforeEach(async () => {
                const inputElemFn = async () =>
                    await findByTestIdChain(
                        "Line-0",
                        "EditableLine",
                        "InnerInput"
                    );

                fireEvent.change(await inputElemFn(), {
                    target: { value: "" },
                });

                await act(async () => {
                    (await inputElemFn()).dispatchEvent(
                        pasteEvent(["ABC", "as easy as"])
                    );
                });
            });

            test("it pastes in the first line", async () => {
                await expectChordAndLyric("", "ABC", [
                    "Line-0",
                    "NoneditableLine",
                ]);
            });

            test("adds the other lines below the first line", async () => {
                await expectChordAndLyric("", "as easy as", [
                    "Line-1",
                    "NoneditableLine",
                ]);
            });

            test("it pushes down the second line", async () => {
                await expectChordAndLyric("", "123", [
                    "Line-2",
                    "NoneditableLine",
                ]);
            });
        });
    });

    describe("in the end of a line with some text", () => {
        let findByTestIdChain: FindByTestIdChainFn;
        let expectChordAndLyric: ExpectChordAndLyricFn;

        beforeEach(async () => {
            const chordPaper = chordPaperFromLyrics([
                "AB",
                "Are simple as do re mi",
            ]);
            const { findByTestId } = render(chordPaper);
            findByTestIdChain = getFindByTestIdChain(findByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findByTestId);

            await startEdit(findByTestIdChain, "Line-0", "NoneditableLine");
        });

        describe("pasting multiple lines", () => {
            beforeEach(async () => {
                const input = await findByTestIdChain(
                    "Line-0",
                    "EditableLine",
                    "InnerInput"
                );

                act(() => {
                    input.dispatchEvent(pasteEvent(["C", "as easy as", "123"]));
                });
            });
            test("it pastes in the remainder of the first line", async () => {
                await expectChordAndLyric("", "ABC", [
                    "Line-0",
                    "NoneditableLine",
                ]);
            });

            test("adds the other lines below the first line", async () => {
                await expectChordAndLyric("", "as easy as", [
                    "Line-1",
                    "NoneditableLine",
                ]);

                await expectChordAndLyric("", "123", [
                    "Line-2",
                    "NoneditableLine",
                ]);
            });

            test("it pushes down the second line", async () => {
                await expectChordAndLyric("", "Are simple as do re mi", [
                    "Line-3",
                    "NoneditableLine",
                ]);
            });
        });
    });
});
