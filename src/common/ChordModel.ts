import { Collection, IDable } from "./Collection";
import shortid from "shortid";
import { tokenize } from "./LyricTokenizer";

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

    get lyricTokens(): string[] {
        return tokenize(this.lyric);
    }

    // splits a block, and returns the block before
    // e.g.
    // {id:"A", chord: "B7", lyric:"my dear we're"}
    // splitBlock(4) =>
    // {id:"B", chord: "B7", lyric:"my dear "}
    // {id:"A", chord: "", "we're"}
    split(splitIndex: number): ChordBlock {
        if (splitIndex === 0) {
            throw new Error("Split index can't be zero");
        }

        const tokens = this.lyricTokens;
        const prevBlockLyricTokens: string[] = tokens.slice(0, splitIndex);
        const thisBlockLyricTokens: string[] = tokens.slice(splitIndex);

        const prevBlock: ChordBlock = new ChordBlock({
            chord: this.chord,
            lyric: prevBlockLyricTokens.join(""),
        });

        this.chord = "";
        this.lyric = thisBlockLyricTokens.join("");

        return prevBlock;
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

    splitBlock(idable: IDable<"ChordBlock">, splitIndex: number): void {
        const index = this.indexOf(idable.id);
        const block = this.elements[index];
        const newPrevBlock = block.split(splitIndex);
        this.elements.splice(index, 0, newPrevBlock);
    }

    clone(): ChordLine {
        const clone = new ChordLine(this.elements);
        clone.id = this.id;
        return clone;
    }
}

interface SongMetadata {
    title: string;
    composedBy: string;
    performedBy: string;
    asHeardFrom: string;
}

export class ChordSong extends Collection<ChordLine, "ChordLine"> {
    metadata: SongMetadata;

    constructor(elements?: ChordLine[], metadata?: SongMetadata) {
        super(elements);

        if (metadata !== undefined) {
            this.metadata = metadata;
        } else {
            this.metadata = {
                title: "",
                composedBy: "",
                performedBy: "",
                asHeardFrom: "",
            };
        }
    }

    static fromLyricsLines(lyricLines: string[]): ChordSong {
        const chordLines: ChordLine[] = lyricLines.map((lyricLine: string) =>
            ChordLine.fromLyrics(lyricLine)
        );
        return new ChordSong(chordLines);
    }

    get chordLines(): ChordLine[] {
        return this.elements;
    }

    get title(): string {
        return this.metadata.title;
    }

    set title(newTitle: string) {
        this.metadata.title = newTitle;
    }

    get performedBy(): string {
        return this.metadata.performedBy;
    }

    set performedBy(newPerformedBy: string) {
        this.metadata.performedBy = newPerformedBy;
    }

    get composedBy(): string {
        return this.metadata.composedBy;
    }

    set composedBy(newComposedBy: string) {
        this.metadata.composedBy = newComposedBy;
    }

    get asHeardFrom(): string {
        return this.metadata.asHeardFrom;
    }

    set asHeardFrom(newAsHeardFrom: string) {
        this.metadata.asHeardFrom = newAsHeardFrom;
    }

    clone(): ChordSong {
        return new ChordSong(this.elements, this.metadata);
    }

    serialize(): string {
        return JSON.stringify(this);
    }

    static deserialize(json: string): ChordSong {
        console.log("JSON", json);
        const parsedObj = JSON.parse(json);
        console.log("Parsed JSON", parsedObj);
        return new ChordSong(parsedObj.elements, parsedObj.metadata);
    }
}
