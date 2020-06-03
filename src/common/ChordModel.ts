import { Collection, IDable } from "./Collection";
import shortid from "shortid";
import { tokenize } from "./LyricTokenizer";
import * as iots from "io-ts";
import { Either, right, left, isLeft, parseJSON } from "fp-ts/lib/Either";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: string;
}

const stringifyIgnoreID = (obj: unknown): string => {
    return JSON.stringify(obj, (key: string, value: string) => {
        if (key === "id") {
            return undefined;
        }

        return value;
    });
};

const ChordBlockValidator = iots.type({
    chord: iots.string,
    lyric: iots.string,
    type: iots.literal("ChordBlock"),
});

type ChordBlockValidatedFields = iots.TypeOf<typeof ChordBlockValidator>;

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

    serialize(): string {
        return stringifyIgnoreID(this);
    }

    static fromValidatedFields(
        validatedFields: ChordBlockValidatedFields
    ): ChordBlock {
        return new ChordBlock({
            chord: validatedFields.chord,
            lyric: validatedFields.lyric,
        });
    }

    static deserialize(jsonStr: string): Either<Error, ChordBlock> {
        const result: Either<Error, unknown> = parseJSON(
            jsonStr,
            () => new Error("Failed to parse json string")
        );

        if (isLeft(result)) {
            return result;
        }

        const jsonObj = result.right;
        const validationResult = ChordBlockValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Block object"));
        }

        return right(
            new ChordBlock({
                chord: validationResult.right.chord,
                lyric: validationResult.right.lyric,
            })
        );
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

const ChordLineValidator = iots.type({
    elements: iots.array(ChordBlockValidator),
    type: iots.literal("ChordLine"),
});
type ChordLineValidatedFields = iots.TypeOf<typeof ChordLineValidator>;

export class ChordLine extends Collection<ChordBlock, "ChordBlock">
    implements IDable<"ChordLine"> {
    id: string;
    type: "ChordLine";

    constructor(elements?: ChordBlock[]) {
        super(elements);

        this.id = shortid.generate();
        this.type = "ChordLine";
    }

    static fromValidatedFields(
        validatedFields: ChordLineValidatedFields
    ): ChordLine {
        const chordBlockElems: ChordBlock[] = validatedFields.elements.map(
            (value: ChordBlockValidatedFields) => {
                return ChordBlock.fromValidatedFields(value);
            }
        );

        return new ChordLine(chordBlockElems);
    }

    serialize(): string {
        return stringifyIgnoreID(this);
    }

    static deserialize(jsonStr: string): Either<Error, ChordLine> {
        const result: Either<Error, unknown> = parseJSON(
            jsonStr,
            () => new Error("Failed to parse json string")
        );

        if (isLeft(result)) {
            return result;
        }

        const jsonObj = result.right;
        const validationResult = ChordLineValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Line object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
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

const SongMetadataValidator = iots.type({
    title: iots.string,
    composedBy: iots.string,
    performedBy: iots.string,
    asHeardFrom: iots.string,
});

type SongMetadata = iots.TypeOf<typeof SongMetadataValidator>;

const ChordSongValidator = iots.type({
    elements: iots.array(ChordLineValidator),
    metadata: SongMetadataValidator,
});
type ChordSongValidatedFields = iots.TypeOf<typeof ChordSongValidator>;

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

    static fromValidatedFields(
        validatedFields: ChordSongValidatedFields
    ): ChordSong {
        const chordLines: ChordLine[] = validatedFields.elements.map(
            (chordLineValidatedFields: ChordLineValidatedFields) => {
                return ChordLine.fromValidatedFields(chordLineValidatedFields);
            }
        );
        return new ChordSong(chordLines, validatedFields.metadata);
    }

    serialize(): string {
        return stringifyIgnoreID(this);
    }

    static deserialize(jsonStr: string): Either<Error, ChordSong> {
        const result: Either<Error, unknown> = parseJSON(
            jsonStr,
            () => new Error("Failed to parse json string")
        );

        if (isLeft(result)) {
            return result;
        }

        const jsonObj = result.right;
        const validationResult = ChordSongValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Song object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
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
}
