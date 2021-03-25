import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordLine } from "../ChordLine";
import { ChordBlock } from "../ChordBlock";
import { ChordSong } from "../ChordSong";
import { Lyric } from "../Lyric";

describe("Chord Song", () => {
    const testLines = (): ChordLine[] => {
        return [
            new ChordLine([
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
            ]),
            new ChordLine([
                new ChordBlock({
                    chord: "D7b9#11",
                    lyric: new Lyric("You know the rules "),
                }),
                new ChordBlock({
                    chord: "Eb9",
                    lyric: new Lyric("and so do I"),
                }),
            ]),
        ];
    };

    let c: ChordSong;
    beforeEach(() => {
        c = new ChordSong(testLines(), {
            id: "idiomatic",
            owner: "Crick Ghastley",
            metadata: {
                title: "Never Gonna Give You Up",
                composedBy: "Me",
                performedBy: "Rick Astley",
            },
            lastSavedAt: new Date(),
            trackList: [{ label: "Original", url: "nevergonnagiveyouup.com" }],
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

    describe("deepClone", () => {
        let clone: ChordSong;
        beforeEach(() => {
            clone = c.deepClone();
        });

        test("has no id", () => {
            expect(clone.id).toEqual("");
        });

        test("has no owner", () => {
            expect(clone.owner).toEqual("");
        });

        test("has no last saved time", () => {
            expect(clone.lastSavedAt).toEqual(null);
        });

        test("modifying clone does not affect original", () => {
            const line = clone.elements[0];
            const block = line.elements[0];
            block.chord = "Abm9";

            expect(c.elements[0].elements[0].chord).toEqual("A7");
        });
    });

    describe("de/serialization", () => {
        const failSong = (): ChordSong => {
            expect(false).toEqual(true);
            return new ChordSong();
        };

        test("deserializing a serialized chordsong", () => {
            const json = JSON.stringify(c);
            const results = ChordSong.deserialize(json);

            const deserialized: ChordSong = getOrElse(failSong)(results);
            expect(deserialized).toMatchObject({
                id: "idiomatic",
                owner: "Crick Ghastley",
                metadata: {
                    title: "Never Gonna Give You Up",
                    composedBy: "Me",
                    performedBy: "Rick Astley",
                },
                trackList: [
                    { label: "Original", url: "nevergonnagiveyouup.com" },
                ],
                elements: [
                    {
                        elements: [
                            {
                                chord: "A7",
                                lyric: { serializedLyric: "We're no " },
                            },
                            {
                                chord: "Bm",
                                lyric: { serializedLyric: "strangers to " },
                            },
                            {
                                chord: "Cdim",
                                lyric: { serializedLyric: "love" },
                            },
                        ],
                    },
                    {
                        elements: [
                            {
                                chord: "D7b9#11",
                                lyric: {
                                    serializedLyric: "You know the rules ",
                                },
                            },
                            {
                                chord: "Eb9",
                                lyric: { serializedLyric: "and so do I" },
                            },
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
                `{"elements":[{"elements":[{"lyric":{"serializedLyric":"We're no "},"type":"ChordBlock"},{"chord":"Bm","lyric":{"serializedLyric":"strangers to "},"type":"ChordBlock"},{"chord":"Cdim","lyric":{"serializedLyric":"love"},"type":"ChordBlock"}],"type":"ChordLine"},{"elements":[{"chord":"D7b9#11","lyric":{"serializedLyric":"You know the rules "},"type":"ChordBlock"},{"chord":"Eb9","lyric":{"serializedLyric":"and so do I"},"type":"ChordBlock"}],"type":"ChordLine"}],"metadata":{"title":"Never Gonna Give You Up","composedBy":"Me","performedBy":"Rick Astley"}}`
            );
            expect(isLeft(results)).toEqual(true);
        });

        test("missing metadata field", () => {
            const results = ChordSong.deserialize(
                `{"elements":[{"elements":[{"chord":"A7","lyric":{"serializedLyric":"We're no "},"type":"ChordBlock"},{"chord":"Bm","lyric":{"serializedLyric":"strangers to "},"type":"ChordBlock"},{"chord":"Cdim","lyric":{"serializedLyric":"love"},"type":"ChordBlock"}],"type":"ChordLine"},{"elements":[{"chord":"D7b9#11","lyric":{"serializedLyric":"You know the rules "},"type":"ChordBlock"},{"chord":"Eb9","lyric":{"serializedLyric":"and so do I"},"type":"ChordBlock"}],"type":"ChordLine"}],"metadata":{"title":"Never Gonna Give You Up","composedBy":"Me"}}`
            );
            expect(isLeft(results)).toEqual(true);
        });
    });

    test("fromLyricLines", () => {
        const song = ChordSong.fromLyricsLines([
            new Lyric("A full commitment's what I'm thinking of"),
            new Lyric("You wouldn't get this from any other guy"),
        ]);

        expect(song.chordLines).toHaveLength(2);
        expect(song.chordLines[0].chordBlocks).toHaveLength(1);
        expect(song.chordLines[0].chordBlocks[0].chord).toEqual("");
        expect(song.chordLines[0].chordBlocks[0].lyric).toEqual(
            new Lyric("A full commitment's what I'm thinking of")
        );

        expect(song.chordLines[1].chordBlocks).toHaveLength(1);
        expect(song.chordLines[1].chordBlocks[0].chord).toEqual("");
        expect(song.chordLines[1].chordBlocks[0].lyric).toEqual(
            new Lyric("You wouldn't get this from any other guy")
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
                        { chord: "A7", lyric: new Lyric("We're no ") },
                        { chord: "Bm", lyric: new Lyric("strangers to ") },
                        { chord: "Cdim", lyric: new Lyric("love") },
                    ],
                },
                {
                    elements: [
                        {
                            chord: "D7b9#11",
                            lyric: new Lyric("You know the rules "),
                        },
                        { chord: "Eb9", lyric: new Lyric("and so do I") },
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
                        { chord: "A7", lyric: new Lyric("We're no ") },
                        { chord: "Bm", lyric: new Lyric("strangers to ") },
                        { chord: "Cdim", lyric: new Lyric("love ") },
                        {
                            chord: "D7b9#11",
                            lyric: new Lyric("You know the rules "),
                        },
                        { chord: "Eb9", lyric: new Lyric("and so do I") },
                    ],
                },
            ]);
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordSong;
            let now: Date;

            beforeEach(() => {
                now = new Date("2020-10-16T11:57:09.952Z");

                original = new ChordSong(
                    [
                        new ChordLine(
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
                        ),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: new Lyric("You know the rules "),
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: new Lyric("and so do I"),
                            }),
                        ]),
                    ],
                    {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                        trackList: [
                            {
                                label: "Original",
                                url: "nevergonnagiveyouup.com",
                            },
                        ],
                    }
                );
            });

            test("passes if the same", () => {
                const other = new ChordSong(
                    [
                        new ChordLine(
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
                        ),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: new Lyric("You know the rules "),
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: new Lyric("and so do I"),
                            }),
                        ]),
                    ],
                    {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                        trackList: [
                            {
                                label: "Original",
                                url: "nevergonnagiveyouup.com",
                            },
                        ],
                    }
                );

                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if label is different", () => {
                const other = new ChordSong(
                    [
                        new ChordLine(
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
                        ),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: new Lyric("You know the rules "),
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: new Lyric("and so do I"),
                            }),
                        ]),
                    ],
                    {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                        trackList: [
                            {
                                label: "Original",
                                url: "nevergonnagiveyouup.com",
                            },
                        ],
                    }
                );

                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordSong(
                    [
                        new ChordLine(
                            [
                                new ChordBlock({
                                    chord: "Am",
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
                        ),
                        new ChordLine([
                            new ChordBlock({
                                chord: "D7b9#11",
                                lyric: new Lyric("You know the rules "),
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: new Lyric("and so do I"),
                            }),
                        ]),
                    ],
                    {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                        trackList: [
                            {
                                label: "Original",
                                url: "nevergonnagiveyouup.com",
                            },
                        ],
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
                                lyric: new Lyric("You know the rules "),
                            }),
                            new ChordBlock({
                                chord: "Eb9",
                                lyric: new Lyric("and so do I"),
                            }),
                        ]),
                        new ChordLine(
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
                        ),
                    ],
                    {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                        trackList: [
                            {
                                label: "Original",
                                url: "nevergonnagiveyouup.com",
                            },
                        ],
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
                            lyric: new Lyric(""),
                        }),
                    ]),
                ]);
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });

    describe("findLineAndBlock", () => {
        describe("finding the block with the line", () => {
            test("in the first line", () => {
                const blockID = c.chordLines[0].chordBlocks[1];
                const [line, block] = c.findLineAndBlock(blockID);
                expect(line).toEqual(c.chordLines[0]);
                expect(block).toEqual(c.chordLines[0].chordBlocks[1]);
            });

            test("in the second line", () => {
                const blockID = c.chordLines[1].chordBlocks[0];
                const [line, block] = c.findLineAndBlock(blockID);
                expect(line).toEqual(c.chordLines[1]);
                expect(block).toEqual(c.chordLines[1].chordBlocks[0]);
            });
        });
    });
});
