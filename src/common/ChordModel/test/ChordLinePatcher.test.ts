import { replaceChordLineLyrics } from "../ChordLinePatcher";
import { ChordLine } from "../ChordLine";
import { ChordBlock, Lyric } from "../ChordBlock";

describe("ChordLinePatcher", () => {
    let chordLine: ChordLine;

    beforeEach(() => {
        chordLine = new ChordLine([
            new ChordBlock({
                chord: "F",
                lyric: new Lyric("It's your fault "),
            }),
            new ChordBlock({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            }),
        ]);
    });

    describe("no op", () => {
        test("it doesn't change anything", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault that I'm in trouble")
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });
    });

    describe("mixed operations", () => {
        test("replacing a word at the beginning of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault so I'm in trouble")
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("so I'm in trouble"),
            });
        });

        test("insertions deletions and replacements everywhere", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("Not really my fault that I am trooble")
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("Not really my fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I am trooble"),
            });
        });
    });

    describe("insertion", () => {
        test("adding a word in the middle of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's really your fault that I'm in trouble")
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's really your fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });

        test("adding a word in the end of the block", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault really that I'm in trouble")
            );

            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your fault really "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });

        describe("adding a word in the beginning of the line", () => {
            test("with a chord at the beginning", () => {
                replaceChordLineLyrics(
                    chordLine,
                    new Lyric("Verse: It's your fault that I'm in trouble")
                );

                expect(chordLine.elements[0]).toMatchObject({
                    chord: "",
                    lyric: new Lyric("Verse: "),
                });
                expect(chordLine.elements[1]).toMatchObject({
                    chord: "F",
                    lyric: new Lyric("It's your fault "),
                });
                expect(chordLine.elements[2]).toMatchObject({
                    chord: "C",
                    lyric: new Lyric("that I'm in trouble"),
                });
            });

            test("with no chord at the beginning", () => {
                chordLine = new ChordLine([
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("It's your fault "),
                    }),
                    new ChordBlock({
                        chord: "C",
                        lyric: new Lyric("that I'm in trouble"),
                    }),
                ]);

                replaceChordLineLyrics(
                    chordLine,
                    new Lyric("Verse: It's your fault that I'm in trouble")
                );

                expect(chordLine.elements[0]).toMatchObject({
                    chord: "",
                    lyric: new Lyric("Verse: It's your fault "),
                });
                expect(chordLine.elements[1]).toMatchObject({
                    chord: "C",
                    lyric: new Lyric("that I'm in trouble"),
                });
            });
        });
    });

    describe("removal", () => {
        test("removing a word from the middle", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your that I'm in trouble")
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });

        test("removing a word from the end", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It's your fault that I'm in")
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in"),
            });
        });

        test("removing a word from the beginning", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("your fault that I'm in trouble")
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("your fault "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });

        test("removing random characters everywhere", () => {
            replaceChordLineLyrics(
                chordLine,
                new Lyric("It your fut hat I'm trouble")
            );
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It your fut "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("hat I'm trouble"),
            });
        });

        test("removing the first block, causing it to be replaced with a string", () => {
            replaceChordLineLyrics(chordLine, new Lyric("that I'm in trouble"));
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric(" "),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric("that I'm in trouble"),
            });
        });

        test("removing the second block, causing it to steal a space from the first", () => {
            replaceChordLineLyrics(chordLine, new Lyric("It's your fault "));
            expect(chordLine.elements[0]).toMatchObject({
                chord: "F",
                lyric: new Lyric("It's your fault"),
            });
            expect(chordLine.elements[1]).toMatchObject({
                chord: "C",
                lyric: new Lyric(" "),
            });
        });
    });
});
