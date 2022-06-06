import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { Lyric } from "common/ChordModel/Lyric";
import "common/ChordModel/test/matcher";

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
        c = new ChordLine({
            blocks: testBlocks(),
            section: {
                type: "time",
                name: "Verse",
                time: 35,
            },
        });
    });

    describe("de/serialization", () => {
        const failLine = (): ChordLine => {
            expect(false).toEqual(true);
            return new ChordLine({});
        };

        test("deserializing a serialized chordline", () => {
            const json = JSON.stringify(c);

            const results = ChordLine.deserialize(json);

            const deserialized: ChordLine = getOrElse(failLine)(results);
            expect(deserialized).toMatchLine({
                blocks: [
                    { chord: "A7", lyric: "We're no " },
                    { chord: "Bm", lyric: "strangers to " },
                    { chord: "Cdim", lyric: "love" },
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

    test("lyrics", () => {
        expect(c.lyrics.get(rawTextFn)).toEqual("We're no strangers to love");
    });

    test("fromLyrics", () => {
        const line = ChordLine.fromLyrics(
            new Lyric("A full commitment's what I'm thinking of")
        );
        expect(line.chordBlocks).toHaveLength(1);
        expect(line.chordBlocks.getAtIndex(0).lyric.get(rawTextFn)).toEqual(
            "A full commitment's what I'm thinking of"
        );
        expect(line.chordBlocks.getAtIndex(0).chord).toEqual("");
    });

    describe("setChord", () => {
        describe("setting a chord to empty", () => {
            test("first chord does not get merged", () => {
                c = c.setChord(c.chordBlocks.getAtIndex(0), "");
                expect(
                    c.chordBlocks.getAtIndex(0).lyric.get(rawTextFn)
                ).toEqual("We're no ");
                expect(c.chordBlocks.getAtIndex(0).chord).toEqual("");
            });

            test("subsequent chord does get merged", () => {
                c = c.setChord(c.chordBlocks.getAtIndex(1), "");
                expect(
                    c.chordBlocks.getAtIndex(0).lyric.get(rawTextFn)
                ).toEqual("We're no strangers to ");
                expect(c.chordBlocks.getAtIndex(0).chord).toEqual("A7");
                expect(
                    c.chordBlocks.getAtIndex(1).lyric.get(rawTextFn)
                ).toEqual("love");
                expect(c.chordBlocks.getAtIndex(1).chord).toEqual("Cdim");
            });
        });

        describe("setting to a new chord", () => {
            test("gets set", () => {
                c = c.setChord(c.chordBlocks.getAtIndex(1), "E7b9");
                expect(
                    c.chordBlocks.getAtIndex(1).lyric.get(rawTextFn)
                ).toEqual("strangers to ");
                expect(c.chordBlocks.getAtIndex(1).chord).toEqual("E7b9");
            });
        });
    });

    describe("splitBlock", () => {
        test("error if splitIndex is 0", () => {
            expect(() =>
                c.splitBlock(c.chordBlocks.getAtIndex(0), 0)
            ).toThrowError();
        });

        test("splits the block", () => {
            c = c.splitBlock(c.chordBlocks.getAtIndex(1), 1);

            expect(c.chordBlocks.getAtIndex(1).chord).toEqual("Bm");
            expect(c.chordBlocks.getAtIndex(1).lyric.get(rawTextFn)).toEqual(
                "strangers"
            );

            expect(c.chordBlocks.getAtIndex(2).chord).toEqual("");
            expect(c.chordBlocks.getAtIndex(2).lyric.get(rawTextFn)).toEqual(
                " to "
            );
        });
    });

    describe("splitByCharIndex", () => {
        test("split at beginning", () => {
            const [currLine, nextLine] = c.splitByCharIndex(0);
            expect(currLine.section?.name).toEqual("Verse");
            expect(currLine.section?.type).toEqual("time");

            expect(currLine.chordBlocks.length).toEqual(1);
            expect(currLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "",
                lyric: "",
            });

            expect(nextLine.section).toEqual(undefined);

            expect(nextLine.chordBlocks.length).toEqual(3);
            expect(nextLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "A7",
                lyric: "We're no ",
            });
            expect(nextLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "Bm",
                lyric: "strangers to ",
            });
            expect(nextLine.chordBlocks.getAtIndex(2)).toMatchBlock({
                chord: "Cdim",
                lyric: "love",
            });
        });

        test("split at block boundary", () => {
            const [currLine, nextLine] = c.splitByCharIndex(9);
            expect(currLine.section?.name).toEqual("Verse");
            expect(currLine.section?.type).toEqual("time");

            expect(currLine.chordBlocks.length).toEqual(1);
            expect(currLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "A7",
                lyric: "We're no ",
            });

            expect(nextLine.section).toEqual(undefined);

            expect(nextLine.chordBlocks.length).toEqual(2);
            expect(nextLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "Bm",
                lyric: "strangers to ",
            });
            expect(nextLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "Cdim",
                lyric: "love",
            });
        });

        test("split at middle of block", () => {
            const [currLine, nextLine] = c.splitByCharIndex(19);
            expect(currLine.section?.name).toEqual("Verse");
            expect(currLine.section?.type).toEqual("time");

            expect(currLine.chordBlocks.length).toEqual(2);
            expect(currLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "A7",
                lyric: "We're no ",
            });
            expect(currLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "Bm",
                lyric: "strangers ",
            });

            expect(nextLine.section).toEqual(undefined);

            expect(nextLine.chordBlocks.length).toEqual(2);
            expect(nextLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "",
                lyric: "to ",
            });
            expect(nextLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "Cdim",
                lyric: "love",
            });
        });

        test("split at end", () => {
            const [currLine, nextLine] = c.splitByCharIndex(26);
            expect(currLine.section?.name).toEqual("Verse");
            expect(currLine.section?.type).toEqual("time");

            expect(currLine.chordBlocks.length).toEqual(3);
            expect(currLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "A7",
                lyric: "We're no ",
            });
            expect(currLine.chordBlocks.getAtIndex(1)).toMatchBlock({
                chord: "Bm",
                lyric: "strangers to ",
            });
            expect(currLine.chordBlocks.getAtIndex(2)).toMatchBlock({
                chord: "Cdim",
                lyric: "love",
            });

            expect(nextLine.section).toEqual(undefined);
            expect(nextLine.chordBlocks.length).toEqual(1);
            expect(nextLine.chordBlocks.getAtIndex(0)).toMatchBlock({
                chord: "",
                lyric: "",
            });
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordLine;
            beforeEach(() => {
                original = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    },
                });
            });

            test("passes if the same", () => {
                const other = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    },
                });
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if missing label", () => {
                const other = new ChordLine({
                    blocks: [
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
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if the label is different", () => {
                const other = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "time",
                        name: "Durp",
                        time: 35,
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if the label is different type", () => {
                const other = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "label",
                        name: "Verse",
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails any blocks are out of order", () => {
                const other = new ChordLine({
                    blocks: [
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
                    section: {
                        type: "time",
                        name: "Verse",
                        time: 35,
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });

        describe("without content", () => {
            let original: ChordLine;
            beforeEach(() => {
                original = new ChordLine({});
            });
            test("passes if the same", () => {
                const other = new ChordLine({});
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails there's content", () => {
                const other = new ChordLine({
                    blocks: [
                        new ChordBlock({
                            chord: "Am",
                            lyric: new Lyric(""),
                        }),
                    ],
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails there's a label", () => {
                const other = new ChordLine({
                    blocks: [],
                    section: {
                        type: "time",
                        name: "Chorus",
                        time: 100,
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });

    describe("isEmpty", () => {
        test("an empty line", () => {
            const line = new ChordLine({});
            expect(line.isEmpty()).toEqual(true);
        });

        test("block has content", () => {
            const line = new ChordLine({
                blocks: [new ChordBlock({ chord: "A7", lyric: new Lyric("") })],
            });
            expect(line.isEmpty()).toEqual(false);
        });
    });
});
