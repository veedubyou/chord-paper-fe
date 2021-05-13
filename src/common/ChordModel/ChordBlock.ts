import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import lodash from "lodash";
import shortid from "shortid";
import { IDable } from "./Collection";
import { Lyric, LyricValidator } from "./Lyric";

interface ChordBlockConstructorParams {
    chord: string;
    lyric: Lyric;
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
        const unionLyric = validatedFields.lyric;
        const serializedLyric = Lyric.fromValidatedFields(unionLyric);

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

        const unionLyric = validationResult.right.lyric;
        const serializedLyric = Lyric.fromValidatedFields(unionLyric);

        return right(
            new ChordBlock({
                chord: validationResult.right.chord,
                lyric: serializedLyric,
            })
        );
    }

    get lyricTokens(): Lyric[] {
        return this.lyric.tokenize();
    }

    // splits a block, and returns the block before
    // e.g.
    // {id:"A", chord: "B7", lyric:"my dear we're"}
    // splitBlock(4) =>
    // {id:"B", chord: "B7", lyric:"my dear "}
    // {id:"A", chord: "", "we're"}
    splitByTokenIndex(splitIndex: number): ChordBlock {
        if (splitIndex === 0) {
            return new ChordBlock({ chord: "", lyric: new Lyric("") });
        }

        const tokens = this.lyricTokens;
        const prevBlockLyricTokens: Lyric[] = tokens.slice(0, splitIndex);
        const thisBlockLyricTokens: Lyric[] = tokens.slice(splitIndex);

        const prevBlock: ChordBlock = new ChordBlock({
            chord: this.chord,
            lyric: Lyric.join(prevBlockLyricTokens, ""),
        });

        this.chord = "";
        this.lyric = Lyric.join(thisBlockLyricTokens, "");

        return prevBlock;
    }

    splitByCharIndex(splitIndex: number): ChordBlock {
        if (splitIndex === 0) {
            return new ChordBlock({ chord: "", lyric: new Lyric("") });
        }

        const lyricString: string = this.lyric.get((s: string) => s);
        const prevBlockLyrics: Lyric = new Lyric(
            lyricString.slice(0, splitIndex)
        );
        const thisBlockLyrics: Lyric = new Lyric(lyricString.slice(splitIndex));

        const prevBlock: ChordBlock = new ChordBlock({
            chord: this.chord,
            lyric: prevBlockLyrics,
        });

        this.chord = "";
        this.lyric = thisBlockLyrics;

        return prevBlock;
    }

    contentEquals(other: ChordBlock): boolean {
        return this.chord === other.chord && this.lyric.isEqual(other.lyric);
    }

    isEmpty(): boolean {
        return this.chord === "" && this.lyric.isEmpty();
    }

    lyricLength(): number {
        const lyricString = this.lyric.get((s: string) => s);
        return lyricString.length;
    }
}
