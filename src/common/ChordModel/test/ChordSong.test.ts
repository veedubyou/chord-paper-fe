import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordLine } from "../ChordLine";
import { ChordBlock } from "../ChordBlock";
import { ChordSong } from "../ChordSong";

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

    describe("mergeLineWithPrevious", () => {
        test("merging first line is no-op", () => {
            const firstLine = c.chordLines[0];
            const didMerge = c.mergeLineWithPrevious(firstLine);

            expect(didMerge).toEqual(false);
            expect(c.elements).toMatchObject([
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
            ]);
        });

        test("merging subsequent lines into the first", () => {
            const secondLine = c.chordLines[1];
            const didMerge = c.mergeLineWithPrevious(secondLine);
            expect(didMerge).toEqual(true);

            expect(c.elements).toMatchObject([
                {
                    elements: [
                        { chord: "A7", lyric: "We're no " },
                        { chord: "Bm", lyric: "strangers to " },
                        { chord: "Cdim", lyric: "love " },
                        {
                            chord: "D7b9#11",
                            lyric: "You know the rules ",
                        },
                        { chord: "Eb9", lyric: "and so do I" },
                    ],
                },
            ]);
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordSong;
            beforeEach(() => {
                original = new ChordSong(
                    [
                        new ChordLine([
                            new ChordBlock({ chord: "A7", lyric: "We're no " }),
                            new ChordBlock({
                                chord: "Bm",
                                lyric: "strangers to ",
                            }),
                            new ChordBlock({ chord: "Cdim", lyric: "love" }),
                        ]),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: "and so do I",
                            }),
                        ]),
                    ],
                    {
                        title: "Never Gonna Give You Up",
                        composedBy: "Stock Watchman",
                        performedBy: "Rick Astley",
                        asHeardFrom: "every time someone rickrolls me",
                    }
                );
            });

            test("passes if the same", () => {
                const other = new ChordSong(
                    [
                        new ChordLine([
                            new ChordBlock({ chord: "A7", lyric: "We're no " }),
                            new ChordBlock({
                                chord: "Bm",
                                lyric: "strangers to ",
                            }),
                            new ChordBlock({ chord: "Cdim", lyric: "love" }),
                        ]),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: "and so do I",
                            }),
                        ]),
                    ],
                    {
                        title: "Never Gonna Give You Up",
                        composedBy: "Stock Watchman",
                        performedBy: "Rick Astley",
                        asHeardFrom: "every time someone rickrolls me",
                    }
                );

                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordSong(
                    [
                        new ChordLine([
                            new ChordBlock({ chord: "Am", lyric: "We're no " }),
                            new ChordBlock({
                                chord: "Bm",
                                lyric: "strangers to ",
                            }),
                            new ChordBlock({ chord: "Cdim", lyric: "love" }),
                        ]),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: "and so do I",
                            }),
                        ]),
                    ],
                    {
                        title: "Never Gonna Give You Up",
                        composedBy: "Stock Watchman",
                        performedBy: "Rick Astley",
                        asHeardFrom: "every time someone rickrolls me",
                    }
                );
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any lines are out of order", () => {
                const other = new ChordSong(
                    [
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: "and so do I",
                            }),
                        ]),
                        new ChordLine([
                            new ChordBlock({ chord: "A7", lyric: "We're no " }),
                            new ChordBlock({
                                chord: "Bm",
                                lyric: "strangers to ",
                            }),
                            new ChordBlock({ chord: "Cdim", lyric: "love" }),
                        ]),
                    ],
                    {
                        title: "Never Gonna Give You Up",
                        composedBy: "Stock Watchman",
                        performedBy: "Rick Astley",
                        asHeardFrom: "every time someone rickrolls me",
                    }
                );
                expect(original.contentEquals(other)).toEqual(false);
            });
        });

        describe("without content", () => {
            let original: ChordSong;
            beforeEach(() => {
                original = new ChordSong();
            });
            test("passes if the same", () => {
                const other = new ChordSong();
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails there's content", () => {
                const other = new ChordSong([
                    new ChordLine([
                        new ChordBlock({
                            chord: "Am",
                            lyric: "",
                        }),
                    ]),
                ]);
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });
});
