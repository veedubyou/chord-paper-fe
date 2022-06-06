import { getOrElse, isLeft } from "fp-ts/lib/Either";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Lyric } from "common/ChordModel/Lyric";
import "common/ChordModel/test/matcher";

describe("Chord Song", () => {
    const testLines = (): ChordLine[] => {
        return [
            new ChordLine({
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
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "D7b9#11",
                        lyric: new Lyric("You know the rules "),
                    }),
                    new ChordBlock({
                        chord: "Eb9",
                        lyric: new Lyric("and so do I"),
                    }),
                ],
            }),
        ];
    };

    let c: ChordSong;
    beforeEach(() => {
        c = new ChordSong({
            lines: testLines(),
            fields: {
                id: "idiomatic",
                owner: "Crick Ghastley",
                metadata: {
                    title: "Never Gonna Give You Up",
                    composedBy: "Me",
                    performedBy: "Rick Astley",
                },
                lastSavedAt: new Date(2021, 0, 2, 3, 4, 5),
            },
        });
    });

    describe("fork", () => {
        let clone: ChordSong;
        beforeEach(() => {
            clone = c.fork();
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
    });

    describe("de/serialization", () => {
        const failSong = (): ChordSong => {
            expect(false).toEqual(true);
            return new ChordSong({});
        };

        test("deserializing a serialized chordsong", () => {
            const json = JSON.stringify(c);
            const results = ChordSong.deserialize(json);

            const deserialized: ChordSong = getOrElse(failSong)(results);
            expect(deserialized).toMatchSong({
                summary: {
                    id: "idiomatic",
                    owner: "Crick Ghastley",
                    metadata: {
                        title: "Never Gonna Give You Up",
                        composedBy: "Me",
                        performedBy: "Rick Astley",
                    },
                    lastSavedAt: new Date(2021, 0, 2, 3, 4, 5),
                },
                lines: [
                    {
                        blocks: [
                            {
                                chord: "A7",
                                lyric: "We're no ",
                            },
                            {
                                chord: "Bm",
                                lyric: "strangers to ",
                            },
                            {
                                chord: "Cdim",
                                lyric: "love",
                            },
                        ],
                    },
                    {
                        blocks: [
                            {
                                chord: "D7b9#11",
                                lyric: "You know the rules ",
                            },
                            {
                                chord: "Eb9",
                                lyric: "and so do I",
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
        const firstLineChordBlocks = song.chordLines.getAtIndex(0).chordBlocks;
        expect(firstLineChordBlocks).toHaveLength(1);
        expect(firstLineChordBlocks.getAtIndex(0).chord).toEqual("");
        expect(firstLineChordBlocks.getAtIndex(0).lyric).toEqual(
            new Lyric("A full commitment's what I'm thinking of")
        );

        const secondLineChordBlocks = song.chordLines.getAtIndex(1).chordBlocks;
        expect(secondLineChordBlocks).toHaveLength(1);
        expect(secondLineChordBlocks.getAtIndex(0).chord).toEqual("");
        expect(secondLineChordBlocks.getAtIndex(0).lyric).toEqual(
            new Lyric("You wouldn't get this from any other guy")
        );
    });

    describe("mergeLineWithPrevious", () => {
        test("merging first line is no-op", () => {
            const priorFirstLine: ChordLine = c.chordLines.getAtIndex(0);
            const priorSecondLine: ChordLine = c.chordLines.getAtIndex(1);

            const [newSong, didMerge] = c.mergeLineWithPrevious(priorFirstLine);

            expect(didMerge).toEqual(false);
            expect(newSong.chordLines.getAtIndex(0)).toEqual(priorFirstLine);
            expect(newSong.chordLines.getAtIndex(1)).toEqual(priorSecondLine);
        });

        test("merging subsequent lines into the first", () => {
            const secondLine: ChordLine = c.chordLines.getAtIndex(1);
            const [newSong, didMerge] = c.mergeLineWithPrevious(secondLine);

            expect(didMerge).toEqual(true);
            expect(newSong.chordLines).toHaveLength(1);

            const newLine = newSong.chordLines.getAtIndex(0);

            expect(newLine).toMatchLine({
                blocks: [
                    { chord: "A7", lyric: "We're no " },
                    { chord: "Bm", lyric: "strangers to " },
                    { chord: "Cdim", lyric: "love " },
                    {
                        chord: "D7b9#11",
                        lyric: "You know the rules ",
                    },
                    { chord: "Eb9", lyric: "and so do I" },
                ],
            });
        });
    });

    describe("contentEquals", () => {
        describe("with content", () => {
            let original: ChordSong;
            let now: Date;

            beforeEach(() => {
                now = new Date("2020-10-16T11:57:09.952Z");

                original = new ChordSong({
                    lines: [
                        new ChordLine({
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
                        }),
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "D7b9#11",
                                    lyric: new Lyric("You know the rules "),
                                }),
                                new ChordBlock({
                                    chord: "Eb9",
                                    lyric: new Lyric("and so do I"),
                                }),
                            ],
                        }),
                    ],
                    fields: {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                    },
                });
            });

            test("passes if the same", () => {
                const other = new ChordSong({
                    lines: [
                        new ChordLine({
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
                        }),
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "D7b9#11",
                                    lyric: new Lyric("You know the rules "),
                                }),
                                new ChordBlock({
                                    chord: "Eb9",
                                    lyric: new Lyric("and so do I"),
                                }),
                            ],
                        }),
                    ],
                    fields: {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                    },
                });

                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails if label is different", () => {
                const other = new ChordSong({
                    lines: [
                        new ChordLine({
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
                        }),
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "D7b9#11",
                                    lyric: new Lyric("You know the rules "),
                                }),
                                new ChordBlock({
                                    chord: "Eb9",
                                    lyric: new Lyric("and so do I"),
                                }),
                            ],
                        }),
                    ],
                    fields: {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                    },
                });

                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any blocks are different", () => {
                const other = new ChordSong({
                    lines: [
                        new ChordLine({
                            blocks: [
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
                            section: {
                                type: "time",
                                name: "Verse",
                                time: 35,
                            },
                        }),
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "D7b9#11",
                                    lyric: new Lyric("You know the rules "),
                                }),
                                new ChordBlock({
                                    chord: "Eb9",
                                    lyric: new Lyric("and so do I"),
                                }),
                            ],
                        }),
                    ],
                    fields: {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });

            test("fails if any lines are out of order", () => {
                const other = new ChordSong({
                    lines: [
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "D7b9#11",
                                    lyric: new Lyric("You know the rules "),
                                }),
                                new ChordBlock({
                                    chord: "Eb9",
                                    lyric: new Lyric("and so do I"),
                                }),
                            ],
                        }),
                        new ChordLine({
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
                        }),
                    ],
                    fields: {
                        id: "idiomatic",
                        owner: "Crick Ghastley",
                        lastSavedAt: now,
                        metadata: {
                            title: "Never Gonna Give You Up",
                            composedBy: "Stock Aitken Waterman",
                            performedBy: "Rick Astley",
                        },
                    },
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });

        describe("without content", () => {
            let original: ChordSong;
            beforeEach(() => {
                original = new ChordSong({});
            });
            test("passes if the same", () => {
                const other = new ChordSong({});
                expect(original.contentEquals(other)).toEqual(true);
            });

            test("fails there's content", () => {
                const other = new ChordSong({
                    lines: [
                        new ChordLine({
                            blocks: [
                                new ChordBlock({
                                    chord: "Am",
                                    lyric: new Lyric(""),
                                }),
                            ],
                        }),
                    ],
                });
                expect(original.contentEquals(other)).toEqual(false);
            });
        });
    });

    describe("findLineWithBlock", () => {
        describe("finding the block with the line", () => {
            test("in the first line", () => {
                const blockID = c.chordLines
                    .getAtIndex(0)
                    .chordBlocks.getAtIndex(1);
                const line = c.findLineWithBlock(blockID);
                expect(line).toEqual(c.chordLines.getAtIndex(0));
            });

            test("in the second line", () => {
                const blockID = c.chordLines
                    .getAtIndex(1)
                    .chordBlocks.getAtIndex(0);
                const line = c.findLineWithBlock(blockID);
                expect(line).toEqual(c.chordLines.getAtIndex(1));
            });
        });
    });
});
