import { Collection, IDable, stringifyIgnoreID } from "./Collection";
import shortid from "shortid";
import * as iots from "io-ts";
import { Either, right, left, isLeft, parseJSON } from "fp-ts/lib/Either";
import { replaceChordLineLyrics } from "./ChordLinePatcher";
import {
    ChordBlockValidator,
    ChordBlockValidatedFields,
    ChordBlock,
} from "./ChordBlock";

export const ChordLineValidator = iots.type({
    elements: iots.array(ChordBlockValidator),
    type: iots.literal("ChordLine"),
});

export type ChordLineValidatedFields = iots.TypeOf<typeof ChordLineValidator>;

export class ChordLine extends Collection<ChordBlock, "ChordBlock">
    implements IDable<"ChordLine"> {
    id: string;
    type: "ChordLine";

    constructor(elements?: ChordBlock[]) {
        if (elements === undefined) {
            elements = [new ChordBlock({ chord: "", lyric: "" })];
        }

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

        replaceChordLineLyrics(this, newLyrics);
    }

    setChord(idable: IDable<"ChordBlock">, newChord: string): void {
        const index = this.indexOf(idable.id);
        this.elements[index].chord = newChord;
        this.normalizeBlocks();
    }

    splitBlock(idable: IDable<"ChordBlock">, splitIndex: number): void {
        const index = this.indexOf(idable.id);
        const block = this.elements[index];
        const newPrevBlock = block.split(splitIndex);
        this.elements.splice(index, 0, newPrevBlock);
    }

    // passes through every block to ensure that blocks without chords exist (except for the first)
    normalizeBlocks(): void {
        const newBlocks: ChordBlock[] = [];

        for (let i = 0; i < this.elements.length; i++) {
            const block = this.elements[i];

            if (block.chord === "" && newBlocks.length > 0) {
                const lastIndex = newBlocks.length - 1;
                newBlocks[lastIndex].lyric += block.lyric;
            } else {
                newBlocks.push(block);
            }
        }

        // avoid rejiggering the data if it's a no-op
        if (newBlocks.length !== this.elements.length) {
            this.elements = newBlocks;
        }
    }

    clone(): ChordLine {
        const clone = new ChordLine(this.elements);
        clone.id = this.id;
        return clone;
    }

    contentEquals(other: ChordLine): boolean {
        if (this.chordBlocks.length !== other.chordBlocks.length) {
            return false;
        }

        const reducer = (
            isEqual: boolean,
            value: ChordBlock,
            index: number
        ): boolean => {
            if (!isEqual) {
                return false;
            }

            const otherBlock = other.chordBlocks[index];
            if (!value.contentEquals(otherBlock)) {
                return false;
            }

            return true;
        };

        return this.chordBlocks.reduce(reducer, true);
    }
}
