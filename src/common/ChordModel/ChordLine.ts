import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import lodash from "lodash";
import shortid from "shortid";
import {
    ChordBlock,
    ChordBlockValidatedFields,
    ChordBlockValidator,
} from "./ChordBlock";
import { replaceChordLineLyrics } from "./ChordLinePatcher";
import { Collection, IDable } from "./Collection";
import { Lyric } from "./Lyric";

const requiredFields = iots.type({
    elements: iots.array(ChordBlockValidator),
    type: iots.literal("ChordLine"),
});

const optionalFields = iots.partial({
    label: iots.string,
});

export const ChordLineValidator = iots.intersection([
    requiredFields,
    optionalFields,
]);

export type ChordLineValidatedFields = iots.TypeOf<typeof ChordLineValidator>;

export class ChordLine extends Collection<ChordBlock>
    implements IDable<ChordLine> {
    id: string;
    type: "ChordLine";
    label?: string;

    constructor(elements?: ChordBlock[], label?: string) {
        if (elements === undefined) {
            elements = [new ChordBlock({ chord: "", lyric: new Lyric("") })];
        }

        super(elements);

        this.id = shortid.generate();
        this.type = "ChordLine";
        this.label = label;
    }

    static fromValidatedFields(
        validatedFields: ChordLineValidatedFields
    ): ChordLine {
        const chordBlockElems: ChordBlock[] = validatedFields.elements.map(
            (value: ChordBlockValidatedFields) => {
                return ChordBlock.fromValidatedFields(value);
            }
        );

        return new ChordLine(chordBlockElems, validatedFields.label);
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

    static fromLyrics(lyrics: Lyric): ChordLine {
        const block = new ChordBlock({
            chord: "",
            lyric: lyrics,
        });

        return new ChordLine([block]);
    }

    get chordBlocks(): ChordBlock[] {
        return this.elements;
    }

    get lyrics(): Lyric {
        const lyricTokens = this.chordBlocks.map(
            (chordBlock: ChordBlock) => chordBlock.lyric
        );

        return Lyric.join(lyricTokens, "");
    }

    replaceLyrics(newLyrics: Lyric): void {
        if (this.lyrics.isEqual(newLyrics)) {
            return;
        }

        replaceChordLineLyrics(this, newLyrics);
    }

    setChord(idable: IDable<ChordBlock>, newChord: string): void {
        const index = this.indexOf(idable.id);
        this.elements[index].chord = newChord;
        this.normalizeBlocks();
    }

    splitBlock(idable: IDable<ChordBlock>, splitIndex: number): void {
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
                newBlocks[lastIndex].lyric.append(block.lyric);
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
        const clone = new ChordLine(this.elements, this.label);
        clone.id = this.id;
        return clone;
    }

    toJSON(): object {
        return lodash.omit(this, "id");
    }

    contentEquals(other: ChordLine): boolean {
        if (this.chordBlocks.length !== other.chordBlocks.length) {
            return false;
        }

        if (this.label !== other.label) {
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

    isEmpty(): boolean {
        if (this.chordBlocks.length > 1) {
            return false;
        }

        if (this.chordBlocks.length === 0) {
            return true;
        }

        return this.chordBlocks[0].isEmpty();
    }
}
