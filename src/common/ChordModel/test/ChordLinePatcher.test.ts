import { replaceChordLineLyrics } from "../ChordLinePatcher";
import { ChordLine } from "../ChordLine";
import { ChordBlock } from "../ChordBlock";

describe("ChordLinePatcher", () => {
    let chordLine: ChordLine;

    beforeEach(() => {
        chordLine = new ChordLine([
            new ChordBlock({ chord: "F", lyric: "It's your fault " }),
            new ChordBlock({ chord: "C", lyric: "that I'm in trouble" }),
        ]);
    });

    describe("no op", () => {
        test("it doesn't change anything", () => {
            replaceChordLineLyrics(
                chordLine,
                "It's your fault that I'm in trouble"
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });
    });

    describe("mixed operations", () => {
        test("replacing a word at the beginning of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                "It's your fault so I'm in trouble"
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "so I'm in trouble",
            });
        });

        test("insertions deletions and replacements everywhere", () => {
            replaceChordLineLyrics(
                chordLine,
                "Not really my fault that I am trooble"
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "Not really my fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I am trooble",
            });
        });
    });

    describe("insertion", () => {
        test("adding a word in the middle of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                "It's really your fault that I'm in trouble"
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's really your fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("adding a word in the end of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                "It's your fault really that I'm in trouble"
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your fault really ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        describe("adding a word in the beginning of the line", () => {
            test("with a chord at the beginning", () => {
                replaceChordLineLyrics(
                    chordLine,
                    "Verse: It's your fault that I'm in trouble"
                );

                expect(chordLine.elements[0]).toMatchObject({
                    chord: "",
                    lyric: "Verse: ",
                });
                expect(chordLine.elements[1]).toMatchObject({
                    chord: "F",
                    lyric: "It's your fault ",
                });
                expect(chordLine.elements[2]).toMatchObject({
                    chord: "C",
                    lyric: "that I'm in trouble",
                });
            });

            test("with no chord at the beginning", () => {
                chordLine = new ChordLine([
                    new ChordBlock({ chord: "", lyric: "It's your fault " }),
                    new ChordBlock({
                        chord: "C",
                        lyric: "that I'm in trouble",
                    }),
                ]);

                replaceChordLineLyrics(
                    chordLine,
                    "Verse: It's your fault that I'm in trouble"
                );

                expect(chordLine.elements[0]).toMatchObject({
                    chord: "",
                    lyric: "Verse: It's your fault ",
                });
                expect(chordLine.elements[1]).toMatchObject({
                    chord: "C",
                    lyric: "that I'm in trouble",
                });
            });
        });
    });

    describe("removal", () => {
        test("removing a word from the middle", () => {
            replaceChordLineLyrics(chordLine, "It's your that I'm in trouble");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing a word from the end", () => {
            replaceChordLineLyrics(chordLine, "It's your fault that I'm in");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in",
            });
        });

        test("removing a word from the beginning", () => {
            replaceChordLineLyrics(chordLine, "your fault that I'm in trouble");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "your fault ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing random characters everywhere", () => {
            replaceChordLineLyrics(chordLine, "It your fut hat I'm trouble");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It your fut ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "hat I'm trouble",
            });
        });

        test("removing the first block, causing it to be replaced with a string", () => {
            replaceChordLineLyrics(chordLine, "that I'm in trouble");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: " ",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: "that I'm in trouble",
            });
        });

        test("removing the second block, causing it to steal a space from the first", () => {
            replaceChordLineLyrics(chordLine, "It's your fault ");
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: "It's your fault",
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: " ",
            });
        });
    });
});
