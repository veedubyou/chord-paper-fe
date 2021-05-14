import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock } from "../ChordBlock";
import { ChordLine } from "../ChordLine";
import { Lyric } from "../Lyric";

const rawTextFn = (rawStr: string) => rawStr;

const expectBlock = (block: ChordBlock, chord: string, lyric: string) => {
    expect(block.chord).toEqual(chord);
    expect(block.lyric.get(rawTextFn)).toEqual(lyric);
};

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
        c = new ChordLine(testBlocks(), {
            type: "time",
            name: "Verse",
            time: 35,
        });
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
                    { chord: "A7", lyric: new Lyric("We're no ") },
                    { chord: "Bm", lyric: new Lyric("strangers to ") },
                    { chord: "Cdim", lyric: new Lyric("love") },
                ],
                section: {
                    type: "time",
                    name: "Verse",
                    time: 35,
                },
            });
        });

        test("missing elements entirely", () => {
            const results = ChordLine.deserialize(`{}`);
            expect(isLeft(results)).toEqual(true);
        });

        test("missing a nested field", () => {
            const results = ChordLine.deserialize(
                `{"elements":[{"lyric":{"serializedLyric":"We're no "},"type":"ChordBlock"},{"chord":"Bm","lyric":{"serializedLyric":"strangers to "},"type":"ChordBlock"},{"chord":"Cdim","lyric":{"serializedLyric":"love"},"type":"ChordBlock"}],"type":"ChordLine","label":"Verse"}`
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

    describe("splitByCharIndex", () => {
        test("split at beginning", () => {
            const prevLine = c.splitByCharIndex(0);
            expect(prevLine.section?.name).toEqual("Verse");
            expect(prevLine.section?.type).toEqual("time");

            expect(prevLine.elements.length).toEqual(1);
            expectBlock(prevLine.elements[0], "", "");

            expect(c.section).toEqual(undefined);

            expect(c.elements.length).toEqual(3);
            expectBlock(c.elements[0], "A7", "We're no ");
            expectBlock(c.elements[1], "Bm", "strangers to ");
            expectBlock(c.elements[2], "Cdim", "love");
        });

        test("split at block boundary", () => {
            const prevLine = c.splitByCharIndex(9);
            expect(prevLine.section?.name).toEqual("Verse");
            expect(prevLine.section?.type).toEqual("time");

            expect(prevLine.elements.length).toEqual(1);
            expectBlock(prevLine.elements[0], "A7", "We're no ");

            expect(c.section).toEqual(undefined);

            expect(c.elements.length).toEqual(2);
            expectBlock(c.elements[0], "Bm", "strangers to ");
            expectBlock(c.elements[1], "Cdim", "love");
        });

        test("split at middle of block", () => {
            const prevLine = c.splitByCharIndex(19);
            expect(prevLine.section?.name).toEqual("Verse");
            expect(prevLine.section?.type).toEqual("time");

            expect(prevLine.elements.length).toEqual(2);
            expectBlock(prevLine.elements[0], "A7", "We're no ");
            expectBlock(prevLine.elements[1], "Bm", "strangers ");

            expect(c.section).toEqual(undefined);

            expect(c.elements.length).toEqual(2);
            expectBlock(c.elements[0], "", "to ");
            expectBlock(c.elements[1], "Cdim", "love");
        });

        test("split at end", () => {
            const prevLine = c.splitByCharIndex(26);
            expect(prevLine.section?.name).toEqual("Verse");
            expect(prevLine.section?.type).toEqual("time");

            expect(prevLine.elements.length).toEqual(3);
            expectBlock(prevLine.elements[0], "A7", "We're no ");
            expectBlock(prevLine.elements[1], "Bm", "strangers to ");
            expectBlock(prevLine.elements[2], "Cdim", "love");

            expect(c.section).toEqual(undefined);
            expect(c.elements.length).toEqual(1);
            expectBlock(c.elements[0], "", "");
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
                    {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    }
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
                    {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    }
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
                    {
                        type: "time",
                        name: "Durp",
                        time: 35,
                    }
                );
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if the label is different type", () => {
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
                    {
                        type: "label",
                        name: "Verse",
                    }
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
                    {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    }
                );
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails any blocks are out of order", () => {
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
                    {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    }
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
                const other = new ChordLine(undefined, {
                    type: "time",
                    name: "Chorus",
                    time: 100,
                });
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
