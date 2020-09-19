import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import lodash from "lodash";
import shortid from "shortid";
import { tokenize } from "../LyricTokenizer";
import { IDable } from "./Collection";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: Lyric;
}

export const LyricValidator = iots.type({
    serializedLyric: iots.string,
});

export type LyricValidatedFields = iots.TypeOf<typeof LyricValidator>;

export class Lyric {
    private serializedLyric: string;

    constructor(serializedLyrics: string) {
        this.serializedLyric = serializedLyrics;
    }

    get<T>(transformFn: (serializedLyrics: string) => T): T {
        return transformFn(this.serializedLyric);
    }

    append(other: Lyric) {
        this.serializedLyric += other.serializedLyric;
    }

    isEmpty(): boolean {
        return this.serializedLyric === "";
    }

    isEqual(other: Lyric): boolean {
        return this.serializedLyric === other.serializedLyric;
    }

    static join(arr: Lyric[], joinChar: string): Lyric {
        const rawLyricStrs: string[] = arr.map((container: Lyric) => {
            return container.serializedLyric;
        });

        return new Lyric(rawLyricStrs.join(joinChar));
    }

    static fromValidatedFields(validatedFields: LyricValidatedFields): Lyric {
        return new Lyric(validatedFields.serializedLyric);
    }
}

export const ChordBlockValidator = iots.type({
    chord: iots.string,
    lyric: LyricValidator,
    type: iots.literal("ChordBlock"),
});

export type ChordBlockValidatedFields = iots.TypeOf<typeof ChordBlockValidator>;

export class ChordBlock implements IDable<ChordBlock> {
    id: string;
    chord: string;
    lyric: Lyric;
    type: "ChordBlock";

    constructor({ chord, lyric }: ChordBlockConstructorParams) {
        this.id = shortid.generate();
        this.chord = chord;
        this.lyric = lyric;
        this.type = "ChordBlock";
    }

    toJSON(): object {
        return lodash.omit(this, "id");
    }

    static fromValidatedFields(
        validatedFields: ChordBlockValidatedFields
    ): ChordBlock {
        const serializedLyric = Lyric.fromValidatedFields(
            validatedFields.lyric
        );

        return new ChordBlock({
            chord: validatedFields.chord,
            lyric: serializedLyric,
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

        const serializedLyric = Lyric.fromValidatedFields(
            validationResult.right.lyric
        );

        return right(
            new ChordBlock({
                chord: validationResult.right.chord,
                lyric: serializedLyric,
            })
        );
    }

    get lyricTokens(): string[] {
        return this.lyric.get(tokenize);
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
            lyric: new Lyric(prevBlockLyricTokens.join("")),
        });

        this.chord = "";
        this.lyric = new Lyric(thisBlockLyricTokens.join(""));

        return prevBlock;
    }

    contentEquals(other: ChordBlock): boolean {
        return this.chord === other.chord && this.lyric === other.lyric;
    }

    isEmpty(): boolean {
        return this.chord === "" && this.lyric.isEmpty();
    }
}
