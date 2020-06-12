import { IDable, stringifyIgnoreID } from "./Collection";
import shortid from "shortid";
import { tokenize } from "../LyricTokenizer";
import * as iots from "io-ts";
import { Either, right, left, isLeft, parseJSON } from "fp-ts/lib/Either";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: string;
}

export const ChordBlockValidator = iots.type({
    chord: iots.string,
    lyric: iots.string,
    type: iots.literal("ChordBlock"),
});

export type ChordBlockValidatedFields = iots.TypeOf<typeof ChordBlockValidator>;

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

    contentEquals(other: ChordBlock): boolean {
        return this.chord === other.chord && this.lyric === other.lyric;
    }
}
