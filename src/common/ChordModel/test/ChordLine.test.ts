import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock, Lyric } from "../ChordBlock";
import { ChordLine } from "../ChordLine";

const rawTextFn = (rawStr: string) => rawStr;

describe("ChordLine", () => {
    const testBlocks = (): ChordBlock[] => {
        return [
            new ChordBlock({
                chord: "A7",
                lyric: new Lyric("We're no "),
            }),
            new ChordBlock({
                chord: "Bm",
                lyric: new Lyric("strangers to "),
            }),
            new ChordBlock({
                chord: "Cdim",
                lyric: new Lyric("love"),
            }),
        ];
    };

    let c: ChordLine;
    beforeEach(() => {
        c = new ChordLine(testBlocks(), "Verse");
    });

    describe("de/serialization", () => {
        const failLine = (): ChordLine => {
            expect(false).toEqual(true);
            return new ChordLine();
        };

        test("deserializing a serialized chordline", () => {
            const json = JSON.stringify(c);
            const results = ChordLine.deserialize(json);

            const deserialized: ChordLine = getOrElse(failLine)(results);
            expect(deserialized).toMatchObject({
                elements: [
                    { chord: "A7", lyric: "We're no " },
                    { chord: "Bm", lyric: "strangers to " },
                    { chord: "Cdim", lyric: "love" },
                ],
                label: "Verse",
            });
        });

        test("missing elements entirely", () => {
            const results = ChordLine.deserialize(`{}`);
            expect(isLeft(results)).toEqual(true);
        });

        test("missing a nested field", () => {
            const results = ChordLine.deserialize(
                `{"elements":[{"lyric":"We're no ","type":"ChordBlock"},{"chord":"Bm","lyric":"strangers to ","type":"ChordBlock"},{"chord":"Cdim","lyric":"love","type":"ChordBlock"}],"type":"ChordLine"}`
            );
            expect(isLeft(results)).toEqual(true);
        });
    });

    describe("clone", () => {
        test("is not object identity equal", () => {
            expect(c !== c.clone()).toEqual(true);
        });

        test("is deep equal", () => {
            expect(c.clone()).toEqual(c);
        });
    });

    test("lyrics", () => {
        expect(c.lyrics.get(rawTextFn)).toEqual("We're no strangers to love");
    });

    test("fromLyrics", () => {
        const line = ChordLine.fromLyrics(
            new Lyric("A full commitment's what I'm thinking of")
        );
        expect(line.chordBlocks).toHaveLength(1);
        expect(line.chordBlocks[0].lyric.get(rawTextFn)).toEqual(
            "A full commitment's what I'm thinking of"
        );
        expect(line.chordBlocks[0].chord).toEqual("");
    });

    describe("setChord", () => {
        describe("setting a chord to empty", () => {
            test("first chord does not get merged", () => {
                c.setChord(c.chordBlocks[0], "");
                expect(c.chordBlocks[0].lyric.get(rawTextFn)).toEqual(
                    "We're no "
                );
                expect(c.chordBlocks[0].chord).toEqual("");
            });

            test("subsequent chord does get merged", () => {
                c.setChord(c.chordBlocks[1], "");
                expect(c.chordBlocks[0].lyric.get(rawTextFn)).toEqual(
                    "We're no strangers to "
                );
                expect(c.chordBlocks[0].chord).toEqual("A7");
                expect(c.chordBlocks[1].lyric.get(rawTextFn)).toEqual("love");
                expect(c.chordBlocks[1].chord).toEqual("Cdim");
            });
        });

        describe("setting to a new chord", () => {
            test("gets set", () => {
                c.setChord(c.chordBlocks[1], "E7b9");
                expect(c.chordBlocks[1].lyric.get(rawTextFn)).toEqual(
                    "strangers to "
                );
                expect(c.chordBlocks[1].chord).toEqual("E7b9");
            });
        });
    });

    describe("splitBlock", () => {
        test("error if splitIndex is 0", () => {
            expect(() => c.splitBlock(c.chordBlocks[0], 0)).toThrowError();
        });

        test("splits the block", () => {
            c.splitBlock(c.chordBlocks[1], 1);

            expect(c.chordBlocks[1].chord).toEqual("Bm");
            expect(c.chordBlocks[1].lyric.get(rawTextFn)).toEqual("strangers");

            expect(c.chordBlocks[2].chord).toEqual("");
            expect(c.chordBlocks[2].lyric.get(rawTextFn)).toEqual(" to ");
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordLine;
            beforeEach(() => {
                original = new ChordLine(
                    [
                        new ChordBlock({
                            chord: "A7",
                            lyric: new Lyric("We're no "),
                        }),
                        new ChordBlock({
                            chord: "Bm",
                            lyric: new Lyric("strangers to "),
                        }),
                        new ChordBlock({
                            chord: "Cdim",
                            lyric: new Lyric("love"),
                        }),
                    ],
                    "Verse"
                );
            });

            test("passes if the same", () => {
                const other = new ChordLine(
                    [
                        new ChordBlock({
                            chord: "A7",
                            lyric: new Lyric("We're no "),
                        }),
                        new ChordBlock({
                            chord: "Bm",
                            lyric: new Lyric("strangers to "),
                        }),
                        new ChordBlock({
                            chord: "Cdim",
                            lyric: new Lyric("love"),
                        }),
                    ],
                    "Verse"
                );
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if missing label", () => {
                const other = new ChordLine([
                    new ChordBlock({
                        chord: "A7",
                        lyric: new Lyric("We're no "),
                    }),
                    new ChordBlock({
                        chord: "Bm",
                        lyric: new Lyric("strangers to "),
                    }),
                    new ChordBlock({
                        chord: "Cdim",
                        lyric: new Lyric("love"),
                    }),
                ]);
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if the label is different", () => {
                const other = new ChordLine(
                    [
                        new ChordBlock({
                            chord: "A7",
                            lyric: new Lyric("We're no "),
                        }),
                        new ChordBlock({
                            chord: "Bm",
                            lyric: new Lyric("strangers to "),
                        }),
                        new ChordBlock({
                            chord: "Cdim",
                            lyric: new Lyric("love"),
                        }),
                    ],
                    "Chorus"
                );
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordLine(
                    [
                        new ChordBlock({
                            chord: "A7",
                            lyric: new Lyric("We're no "),
                        }),
                        new ChordBlock({
                            chord: "Bm7",
                            lyric: new Lyric("strangers to "),
                        }),
                        new ChordBlock({
                            chord: "Cdim",
                            lyric: new Lyric("love"),
                        }),
                    ],
                    "Verse"
                );
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails any blocks are out of order different", () => {
                const other = new ChordLine(
                    [
                        new ChordBlock({
                            chord: "A7",
                            lyric: new Lyric("We're no "),
                        }),
                        new ChordBlock({
                            chord: "Cdim",
                            lyric: new Lyric("love"),
                        }),
                        new ChordBlock({
                            chord: "Bm",
                            lyric: new Lyric("strangers to "),
                        }),
                    ],
                    "Verse"
                );
                expect(original.contentEquals(other)).toEqual(false);
            });
        });

        describe("without content", () => {
            let original: ChordLine;
            beforeEach(() => {
                original = new ChordLine();
            });
            test("passes if the same", () => {
                const other = new ChordLine();
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails there's content", () => {
                const other = new ChordLine([
                    new ChordBlock({
                        chord: "Am",
                        lyric: new Lyric(""),
                    }),
                ]);
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails there's a label", () => {
                const other = new ChordLine(undefined, "Chorus");
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });

    describe("isEmpty", () => {
        test("an empty line", () => {
            const line = new ChordLine();
            expect(line.isEmpty()).toEqual(true);
        });

        test("block has content", () => {
            const line = new ChordLine([
                new ChordBlock({ chord: "A7", lyric: new Lyric("") }),
            ]);
            expect(line.isEmpty()).toEqual(false);
        });
    });
});
