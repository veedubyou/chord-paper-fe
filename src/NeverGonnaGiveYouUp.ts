import { tokenize } from "./common/LyricTokenizer";
import { ChordSong } from "./common/ChordModel/ChordSong";
import { ChordLine } from "./common/ChordModel/ChordLine";
import { ChordBlock } from "./common/ChordModel/ChordBlock";

const lyrics = [
    "We're no strangers to love",
    "You know the rules and so do I",
    "A full commitment's what I'm thinking of",
    "You wouldn't get this from any other guy",
    "I just wanna tell you how I'm feeling",
    "Gotta make you understand",
    "Never gonna give you up",
    "Never gonna let you down",
    "Never gonna run around and desert you",
    "Never gonna make you cry",
    "Never gonna say goodbye",
    "Never gonna tell a lie and hurt you",
];

const chords = ["A", "Bb7", "Cm", "D/C#", "Em7", "Fmaj7", "G^"];

const randomChord = (): string => {
    return chords[Math.floor(Math.random() * chords.length)];
};

const chunk = (arr: string, tokenSize: number): string[] => {
    const tokens = tokenize(arr);
    const results: string[] = [];

    for (let i = 0; i < tokens.length; i += tokenSize) {
        const subArr = tokens.slice(i, i + tokenSize);
        results.push(subArr.join(""));
    }

    return results;
};

export const NeverGonnaGiveYouUp = (): ChordSong => {
    const chordLines: ChordLine[] = lyrics.map((lyricLine: string) =>
        assembleLine(lyricLine)
    );

    return new ChordSong(chordLines, {
        title: "Never Gonna Give You Up",
        performedBy: "Rick Astley",
        composedBy: "Stock Waterman",
        asHeardFrom: "https://www.youtube.com/watch?v=dM9zwZCOmjM",
    });
};

const assembleLine = (lyrics: string): ChordLine => {
    const lyricChunks = chunk(lyrics, 4);

    const chordBlocks: ChordBlock[] = lyricChunks.map((lyricChunk: string) => {
        return new ChordBlock({
            chord: randomChord(),
            lyric: lyricChunk,
        });
    });

    return new ChordLine(chordBlocks);
};
