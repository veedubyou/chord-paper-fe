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

const LabelSectionValidator = iots.type({
    type: iots.literal("label"),
    name: iots.string,
});

const TimeSectionValidator = iots.type({
    type: iots.literal("time"),
    name: iots.string,
    time: iots.number,
});

const SectionValidator = iots.union([
    LabelSectionValidator,
    TimeSectionValidator,
]);

const optionalFields = iots.partial({
    label: iots.string,
    section: SectionValidator,
});

export const ChordLineValidator = iots.intersection([
    requiredFields,
    optionalFields,
]);

export type LabelSection = iots.TypeOf<typeof LabelSectionValidator>;
export type TimeSection = iots.TypeOf<typeof TimeSectionValidator>;
export type Section = iots.TypeOf<typeof SectionValidator>;
export type ChordLineValidatedFields = iots.TypeOf<typeof ChordLineValidator>;

export class ChordLine extends Collection<ChordBlock>
    implements IDable<ChordLine> {
    id: string;
    type: "ChordLine";
    section?: Section;

    constructor(elements?: ChordBlock[], section?: Section) {
        if (elements === undefined) {
            elements = [new ChordBlock({ chord: "", lyric: new Lyric("") })];
        }

        super(elements);

        this.id = shortid.generate();
        this.type = "ChordLine";
        this.section = section;
    }

    static sectionFromLabel(label?: string): Section | undefined {
        if (label === undefined) {
            return undefined;
        }

        return {
            type: "label",
            name: label,
        };
    }

    static fromValidatedFields(
        validatedFields: ChordLineValidatedFields
    ): ChordLine {
        const chordBlockElems: ChordBlock[] = validatedFields.elements.map(
            (value: ChordBlockValidatedFields) => {
                return ChordBlock.fromValidatedFields(value);
            }
        );

        let section: Section | undefined = validatedFields.section;
        if (section === undefined) {
            section = this.sectionFromLabel(validatedFields.label);
        }

        return new ChordLine(chordBlockElems, section);
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

    removeSectionName(): boolean {
        if (this.section === undefined) {
            return false;
        }

        this.section = undefined;

        return true;
    }

    setSectionName(newName: string): boolean {
        if (newName === "") {
            return this.removeSectionName();
        }

        if (this.section === undefined) {
            this.section = {
                type: "label",
                name: newName,
            };

            return true;
        }

        this.section.name = newName;
        return true;
    }

    removeSectionTime(): boolean {
        if (this.section === undefined) {
            return false;
        }

        this.section = {
            type: "label",
            name: this.section.name,
        };

        return true;
    }

    setSectionTime(newTime: number | null): boolean {
        if (newTime === null) {
            return this.removeSectionTime();
        }

        const name = this.section !== undefined ? this.section.name : "";

        this.section = {
            type: "time",
            name: name,
            time: newTime,
        };

        return true;
    }

    // normalizeSection(): void {
    //     if (this.section === undefined) {
    //         return;
    //     }

    //     if (this.section.type === "label" && this.section.name === "") {
    //         this.section = undefined;
    //         return;
    //     }

    //     if (this.section.type === "time") {
    //         if (this.section.name === "" && th)
    //     }
    // }

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
        const clone = new ChordLine(this.elements, this.section);
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

        if (this.section !== other.section) {
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
