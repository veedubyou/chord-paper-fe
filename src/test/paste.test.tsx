import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { chordPaperFromLyrics } from "./common";
import {
    ExpectChordAndLyricFn,
    FindByTestIdChainFn,
    getExpectChordAndLyric,
    getFindByTestIdChain,
    TestIDParam,
} from "./matcher";
import { changeContentEditableText } from "./userEvent";

afterEach(cleanup);

const startEdit = async (
    findByTestIdChain: FindByTestIdChainFn,
    ...testIDPath: TestIDParam[]
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
            const { findAllByTestId } = render(chordPaper);
            findByTestIdChain = getFindByTestIdChain(findAllByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);

            await startEdit(
                findByTestIdChain,
                ["Line", 0],
                ["NoneditableLine", 0]
            );
        });

        const pasteMultipleLinesTests = (carriageReturn: boolean) => {
            describe("pasting multiple lines", () => {
                beforeEach(async () => {
                    const contentEditableElemFn = async () =>
                        await findByTestIdChain(
                            ["Line", 0],
                            ["LyricInput", 0],
                            ["InnerInput", 0]
                        );

                    changeContentEditableText(
                        await contentEditableElemFn(),
                        ""
                    );

                    await act(async () => {
                        (await contentEditableElemFn()).dispatchEvent(
                            pasteEvent(["ABC", "as easy as"], carriageReturn)
                        );
                    });
                });

                test("it pastes in the first line", async () => {
                    await expectChordAndLyric("", "ABC", [
                        ["Line", 0],
                        ["NoneditableLine", 0],
                    ]);
                });

                test("adds the other lines below the first line", async () => {
                    await expectChordAndLyric("", "as easy as", [
                        ["Line", 1],
                        ["NoneditableLine", 0],
                    ]);
                });

                test("it pushes down the second line", async () => {
                    await expectChordAndLyric("", "123", [
                        ["Line", 2],
                        ["NoneditableLine", 0],
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
            const { findAllByTestId } = render(chordPaper);
            findByTestIdChain = getFindByTestIdChain(findAllByTestId);
            expectChordAndLyric = getExpectChordAndLyric(findAllByTestId);

            await startEdit(
                findByTestIdChain,
                ["Line", 0],
                ["NoneditableLine", 0]
            );
        });

        const pasteMultipleLinesTests = (carriageReturn: boolean) => {
            describe("pasting multiple lines", () => {
                beforeEach(async () => {
                    const input = await findByTestIdChain(
                        ["Line", 0],
                        ["LyricInput", 0],
                        ["InnerInput", 0]
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
                        ["Line", 0],
                        ["NoneditableLine", 0],
                    ]);
                });

                test("adds the other lines below the first line", async () => {
                    await expectChordAndLyric("", "as easy as", [
                        ["Line", 1],
                        ["NoneditableLine", 0],
                    ]);

                    await expectChordAndLyric("", "123", [
                        ["Line", 2],
                        ["NoneditableLine", 0],
                    ]);
                });

                test("it pushes down the second line", async () => {
                    await expectChordAndLyric("", "Are simple as do re mi", [
                        ["Line", 3],
                        ["NoneditableLine", 0],
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
