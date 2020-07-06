import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock } from "../ChordBlock";
import { ChordLine } from "../ChordLine";

describe("ChordLine", () => {
    const testBlocks = (): ChordBlock[] => {
        return [
            new ChordBlock({ chord: "A7", lyric: "We're no " }),
            new ChordBlock({ chord: "Bm", lyric: "strangers to " }),
            new ChordBlock({ chord: "Cdim", lyric: "love" }),
        ];
    };

    let c: ChordLine;
    beforeEach(() => {
        c = new ChordLine(testBlocks());
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
        expect(c.lyrics).toEqual("We're no strangers to love");
    });

    test("fromLyrics", () => {
        const line = ChordLine.fromLyrics(
            "A full commitment's what I'm thinking of"
        );
        expect(line.chordBlocks).toHaveLength(1);
        expect(line.chordBlocks[0].lyric).toEqual(
            "A full commitment's what I'm thinking of"
        );
        expect(line.chordBlocks[0].chord).toEqual("");
    });

    describe("setChord", () => {
        describe("setting a chord to empty", () => {
            test("first chord does not get merged", () => {
                c.setChord(c.chordBlocks[0], "");
                expect(c.chordBlocks[0].lyric).toEqual("We're no ");
                expect(c.chordBlocks[0].chord).toEqual("");
            });

            test("subsequent chord does get merged", () => {
                c.setChord(c.chordBlocks[1], "");
                expect(c.chordBlocks[0].lyric).toEqual(
                    "We're no strangers to "
                );
                expect(c.chordBlocks[0].chord).toEqual("A7");
                expect(c.chordBlocks[1].lyric).toEqual("love");
                expect(c.chordBlocks[1].chord).toEqual("Cdim");
            });
        });

        describe("setting to a new chord", () => {
            test("gets set", () => {
                c.setChord(c.chordBlocks[1], "E7b9");
                expect(c.chordBlocks[1].lyric).toEqual("strangers to ");
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
            expect(c.chordBlocks[1].lyric).toEqual("strangers");

            expect(c.chordBlocks[2].chord).toEqual("");
            expect(c.chordBlocks[2].lyric).toEqual(" to ");
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordLine;
            beforeEach(() => {
                original = new ChordLine([
                    new ChordBlock({ chord: "A7", lyric: "We're no " }),
                    new ChordBlock({ chord: "Bm", lyric: "strangers to " }),
                    new ChordBlock({ chord: "Cdim", lyric: "love" }),
                ]);
            });

            test("passes if the same", () => {
                const other = new ChordLine([
                    new ChordBlock({ chord: "A7", lyric: "We're no " }),
                    new ChordBlock({ chord: "Bm", lyric: "strangers to " }),
                    new ChordBlock({ chord: "Cdim", lyric: "love" }),
                ]);
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordLine([
                    new ChordBlock({ chord: "A7", lyric: "We're no " }),
                    new ChordBlock({ chord: "Bm7", lyric: "strangers to " }),
                    new ChordBlock({ chord: "Cdim", lyric: "love" }),
                ]);
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails any blocks are out of order different", () => {
                const other = new ChordLine([
                    new ChordBlock({ chord: "A7", lyric: "We're no " }),
                    new ChordBlock({ chord: "Cdim", lyric: "love" }),
                    new ChordBlock({ chord: "Bm", lyric: "strangers to " }),
                ]);
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
                        lyric: "",
                    }),
                ]);
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
                new ChordBlock({ chord: "A7", lyric: "" }),
            ]);
            expect(line.isEmpty()).toEqual(false);
        });
    });
});
