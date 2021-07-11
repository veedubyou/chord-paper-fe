import { ChordBlock } from "../ChordBlock";
import { ChordLine } from "../ChordLine";
import { replaceChordLineLyrics } from "../ChordLinePatcher";
import { Lyric } from "../Lyric";
import "./matcher";

describe("ChordLinePatcher", () => {
    let chordLine: ChordLine;

    beforeEach(() => {
        chordLine = new ChordLine({
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
        });
    });

    describe("no op", () => {
        test("it doesn't change anything", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault that I'm in trouble")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });
    });

    describe("mixed operations", () => {
        test("replacing a word at the beginning of the block", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault so I'm in trouble")
            );

            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "so I'm in trouble",
            });
        });

        test("insertions deletions and replacements everywhere", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("Not really my fault that I am trooble")
            );

            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "Not really my fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I am trooble",
            });
        });
    });

    describe("insertion", () => {
        test("adding a word in the middle of the block", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's really your fault that I'm in trouble")
            );

            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's really your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("adding a word in the end of the block", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault really that I'm in trouble")
            );

            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your fault really ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        describe("adding a word in the beginning of the line", () => {
            test("with a chord at the beginning", () => {
                chordLine = replaceChordLineLyrics(
                    chordLine,
                    new Lyric("Verse: It's your fault that I'm in trouble")
                );

                expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                    chord: "",
                    lyric: "Verse: ",
                });
                expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                    chord: "F",
                    lyric: "It's your fault ",
                });
                expect(chordLine.chordBlocks.getAtIndex(2)).toMatchBlock({
                    chord: "C",
                    lyric: "that I'm in trouble",
                });
            });

            test("with no chord at the beginning", () => {
                chordLine = new ChordLine({
                    blocks: [
                        new ChordBlock({
                            chord: "",
                            lyric: new Lyric("It's your fault "),
                        }),
                        new ChordBlock({
                            chord: "C",
                            lyric: new Lyric("that I'm in trouble"),
                        }),
                    ],
                });

                chordLine = replaceChordLineLyrics(
                    chordLine,
                    new Lyric("Verse: It's your fault that I'm in trouble")
                );

                expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                    chord: "",
                    lyric: "Verse: It's your fault ",
                });
                expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                    chord: "C",
                    lyric: "that I'm in trouble",
                });
            });
        });
    });

    describe("removal", () => {
        test("removing a word from the middle", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your that I'm in trouble")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing a word from the end", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault that I'm in")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in",
            });
        });

        test("removing a word from the beginning", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("your fault that I'm in trouble")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing random characters everywhere", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It your fut hat I'm trouble")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It your fut ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "hat I'm trouble",
            });
        });

        test("removing the first block, causing it to be replaced with a tab", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("that I'm in trouble")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "\ue100",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing the second block, causing it to replaced with a tab", () => {
            chordLine = replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault ")
            );
            expect(chordLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "C",
                lyric: "\ue100",
            });
        });
    });
});
