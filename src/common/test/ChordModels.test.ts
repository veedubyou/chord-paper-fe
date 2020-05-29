import { ChordBlock, ChordLine, ChordSong } from "../ChordModels";

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
        c = new ChordSong(testLines());
    });

    describe("clone", () => {
        test("is not object identity equal", () => {
            expect(c !== c.clone()).toEqual(true);
        });

        test("is deep equal", () => {
            expect(c.clone()).toEqual(c);
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
