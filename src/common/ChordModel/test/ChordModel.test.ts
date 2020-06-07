import { ChordBlock, ChordLine, ChordSong } from "../ChordModel";
import { isRight, right, getOrElse, isLeft } from "fp-ts/lib/Either";

describe("ChordBlock", () => {
    describe("de/serialization", () => {
        const testBlock = (): ChordBlock => {
            return new ChordBlock({ chord: "A7", lyric: "We're no " });
        };

        const failBlock = (): ChordBlock => {
            expect(false).toEqual(true);
            return new ChordBlock({ chord: "", lyric: "" });
        };

        test("serializes and deserializes correctly", () => {
            const original = testBlock();
            const json = original.serialize();
            const result = ChordBlock.deserialize(json);

            const deserialized: ChordBlock = getOrElse(failBlock)(result);
            expect(deserialized).toMatchObject({
                chord: "A7",
                lyric: "We're no ",
            });
        });

        test("fails deserialization correctly for malformed JSON", () => {
            const result = ChordBlock.deserialize(
                `{"chord:"A7","lyric":"We're no ","type":"ChordBlock"}`
            );
            expect(isLeft(result)).toEqual(true);
        });

        describe("deserializing invalid object shape", () => {
            test("fails type field check", () => {
                const result = ChordBlock.deserialize(
                    `{"chord":"A7","lyric":"We're no ","type":"ChordLine"}`
                );
                expect(isLeft(result)).toEqual(true);
            });

            test("fails missing chord check", () => {
                const result = ChordBlock.deserialize(
                    `{"lyric":"We're no ","type":"ChordBlock"}`
                );
                expect(isLeft(result)).toEqual(true);
            });

            test("fails missing lyric check", () => {
                const result = ChordBlock.deserialize(
                    `{"chord":"A7","type":"ChordBlock"}`
                );
                expect(isLeft(result)).toEqual(true);
            });
        });
    });
});

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
            const json = c.serialize();
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
});

describe("Chord Song", () => {
    const testLines = (): ChordLine[] => {
        return [
            new ChordLine([
                new ChordBlock({ chord: "A7", lyric: "We're no " }),
                new ChordBlock({ chord: "Bm", lyric: "strangers to " }),
                new ChordBlock({ chord: "Cdim", lyric: "love" }),
            ]),
            new ChordLine([
                new ChordBlock({
                    chord: "D7b9#11",
                    lyric: "You know the rules ",
                }),
                new ChordBlock({ chord: "Eb9", lyric: "and so do I" }),
            ]),
        ];
    };

    let c: ChordSong;
    beforeEach(() => {
        c = new ChordSong(testLines(), {
            title: "Never Gonna Give You Up",
            composedBy: "Me",
            performedBy: "Rick Astley",
            asHeardFrom: "A Rickroll from my youth",
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

    describe("de/serialization", () => {
        const failSong = (): ChordSong => {
            expect(false).toEqual(true);
            return new ChordSong();
        };

        test("deserializing a serialized chordsong", () => {
            const json = c.serialize();
            const results = ChordSong.deserialize(json);

            const deserialized: ChordSong = getOrElse(failSong)(results);
            expect(deserialized).toMatchObject({
                metadata: {
                    title: "Never Gonna Give You Up",
                    composedBy: "Me",
                    performedBy: "Rick Astley",
                    asHeardFrom: "A Rickroll from my youth",
                },
                elements: [
                    {
                        elements: [
                            { chord: "A7", lyric: "We're no " },
                            { chord: "Bm", lyric: "strangers to " },
                            { chord: "Cdim", lyric: "love" },
                        ],
                    },
                    {
                        elements: [
                            {
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            },
                            { chord: "Eb9", lyric: "and so do I" },
                        ],
                    },
                ],
            });
        });

        test("missing elements entirely", () => {
            const results = ChordSong.deserialize(`{}`);
            expect(isLeft(results)).toEqual(true);
        });

        test("missing a nested field", () => {
            const results = ChordLine.deserialize(
                `{"elements":[{"elements":[{"chord":"A7","lyric":"We're no ","type":"ChordBlock"},{"chord":"Bm","lyric":"strangers to ","type":"ChordBlock"},{"chord":"Cdim","lyric":"love","type":"ChordBlock"}],"type":"ChordLine"},{"elements":[{"lyric":"You know the rules ","type":"ChordBlock"},{"chord":"Eb9","lyric":"and so do I","type":"ChordBlock"}],"type":"ChordLine"}],"metadata":{"title":"Never Gonna Give You Up","composedBy":"Me","performedBy":"Rick Astley","asHeardFrom":"A Rickroll from my youth"}}`
            );
            expect(isLeft(results)).toEqual(true);
        });

        test("missing metadata field", () => {
            const results = ChordSong.deserialize(
                `{"elements":[{"elements":[{"chord":"A7","lyric":"We're no ","type":"ChordBlock"},{"chord":"Bm","lyric":"strangers to ","type":"ChordBlock"},{"chord":"Cdim","lyric":"love","type":"ChordBlock"}],"type":"ChordLine"},{"elements":[{"chord":"D7b9#11","lyric":"You know the rules ","type":"ChordBlock"},{"chord":"Eb9","lyric":"and so do I","type":"ChordBlock"}],"type":"ChordLine"}],"metadata":{"title":"Never Gonna Give You Up","composedBy":"Me","performedBy":"Rick Astley"}}`
            );
            expect(isLeft(results)).toEqual(true);
        });
    });

    test("fromLyricLines", () => {
        const song = ChordSong.fromLyricsLines([
            "A full commitment's what I'm thinking of",
            "You wouldn't get this from any other guy",
        ]);

        expect(song.chordLines).toHaveLength(2);
        expect(song.chordLines[0].chordBlocks).toHaveLength(1);
        expect(song.chordLines[0].chordBlocks[0].chord).toEqual("");
        expect(song.chordLines[0].chordBlocks[0].lyric).toEqual(
            "A full commitment's what I'm thinking of"
        );

        expect(song.chordLines[1].chordBlocks).toHaveLength(1);
        expect(song.chordLines[1].chordBlocks[0].chord).toEqual("");
        expect(song.chordLines[1].chordBlocks[0].lyric).toEqual(
            "You wouldn't get this from any other guy"
        );
    });
});
