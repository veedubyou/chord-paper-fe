import { Collection, IDable } from "./Collection";
import shortid from "shortid";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: string;
}

export class ChordBlock implements IDable<"ChordBlock"> {
    id: string;
    chord: string;
    lyric: string;
    type: "ChordBlock";

    constructor({ chord, lyric }: ChordBlockConstructorParams) {
        this.id = shortid.generate();
        this.chord = chord;
        this.lyric = lyric;
        this.type = "ChordBlock";
    }
}

export class ChordLine extends Collection<ChordBlock, "ChordBlock">
    implements IDable<"ChordLine"> {
    id: string;
    type: "ChordLine";

    constructor(elements?: ChordBlock[]) {
        super(elements);

        this.id = shortid.generate();
        this.type = "ChordLine";
    }

    static fromLyrics(lyrics: string): ChordLine {
        const block = new ChordBlock({
            chord: "",
            lyric: lyrics,
        });

        return new ChordLine([block]);
    }

    get chordBlocks(): ChordBlock[] {
        return this.elements;
    }

    get lyrics(): string {
        const lyricTokens = this.chordBlocks.map(
            (chordBlock: ChordBlock) => chordBlock.lyric
        );

        return lyricTokens.join("");
    }

    replaceLyrics(newLyrics: string): void {
        if (newLyrics === this.lyrics) {
            return;
        }

        this.elements = [
            new ChordBlock({
                // TODO: feature next. chords are currently destructively wiped
                // because anchoring information is lost between edits
                chord: "",
                lyric: newLyrics,
            }),
        ];
    }

    setChord(idable: IDable<"ChordBlock">, newChord: string): void {
        const index = this.indexOf(idable.id);

        this.elements[index].chord = newChord;

        if (this.elements[index].chord === "") {
            this.mergeBlocks(index);
        }
    }

    // merge block at index with previous block
    // merging lyrics and discarding chords
    private mergeBlocks(index: number): void {
        if (index === 0) {
            return;
        }

        const prevBlock = this.elements[index - 1];
        prevBlock.lyric += this.elements[index].lyric;
        this.elements.splice(index, 1);
    }

    clone(): ChordLine {
        const clone = new ChordLine(this.elements);
        clone.id = this.id;
        return clone;
    }
}

export class ChordSong extends Collection<ChordLine, "ChordLine"> {
    static fromLyricsLines(lyricLines: string[]): ChordSong {
        const chordLines: ChordLine[] = lyricLines.map((lyricLine: string) =>
            ChordLine.fromLyrics(lyricLine)
        );
        return new ChordSong(chordLines);
    }

    get chordLines(): ChordLine[] {
        return this.elements;
    }

    clone(): ChordSong {
        return new ChordSong(this.elements);
    }
}
