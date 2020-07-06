import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { chordPaperFromLyrics } from "./common";
import {
    ExpectChordAndLyricFn,
    FindByTestIdChainFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
} from "./matcher";

afterEach(cleanup);

beforeAll(() => {
    //https://github.com/mui-org/material-ui/issues/15726#issuecomment-493124813
    global.document.createRange = (): Range => ({
        setStart: () => {},
        setEnd: () => {},
        //@ts-ignore
        commonAncestorContainer: {
            nodeName: "BODY",
            ownerDocument: document,
        },
        selectNodeContents: () => {},
        collapse: () => {},
    });

    global.window.getSelection = () => null;
});

const startEdit = async (
    findByTestIdChain: FindByTestIdChainFn,
    ...testIDPath: string[]
) => {
    const line = await findByTestIdChain(...testIDPath);
    expect(line).toBeInTheDocument();
    fireEvent.mouseOver(line);
    fireEvent.click(line);
};

describe("Pasting Lyrics", () => {
    const pasteEvent = (
        textContent: string[],
        carriageReturn: boolean
    ): Event => {
        const event = new Event("paste", {
            bubbles: true,
            cancelable: true,
            composed: true,
        });

        const joinChar = carriageReturn ? "\r\n" : "\n";
        //@ts-ignore
        event["clipboardData"] = {
            getData: (pasteType: string): string => {
                if (pasteType !== "text/plain") {
                    return "";
                }

                return textContent.join(joinChar);
            },
        };

        return event;
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

        const pasteMultipleLinesTests = (carriageReturn: boolean) => {
            describe("pasting multiple lines", () => {
                beforeEach(async () => {
                    const inputElemFn = async () =>
                        await findByTestIdChain(
                            "Line-0",
                            "EditableLine",
                            "InnerInput"
                        );

                    fireEvent.change(await inputElemFn(), {
                        target: { textContent: "" },
                    });

                    await act(async () => {
                        (await inputElemFn()).dispatchEvent(
                            pasteEvent(["ABC", "as easy as"], carriageReturn)
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
        };

        describe("for mac", () => {
            pasteMultipleLinesTests(false);
        });

        describe("for windows", () => {
            pasteMultipleLinesTests(true);
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

        const pasteMultipleLinesTests = (carriageReturn: boolean) => {
            describe("pasting multiple lines", () => {
                beforeEach(async () => {
                    const input = await findByTestIdChain(
                        "Line-0",
                        "EditableLine",
                        "InnerInput"
                    );

                    act(() => {
                        input.dispatchEvent(
                            pasteEvent(
                                ["C", "as easy as", "123"],
                                carriageReturn
                            )
                        );
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
        };

        describe("for mac", () => {
            pasteMultipleLinesTests(false);
        });

        describe("for windows", () => {
            pasteMultipleLinesTests(true);
        });
    });
});
