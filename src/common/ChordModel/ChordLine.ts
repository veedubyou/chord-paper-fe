import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import lodash from "lodash";
import shortid from "shortid";
import {
    ChordBlock,
    ChordBlockValidatedFields,
    ChordBlockValidator,
} from "common/ChordModel/ChordBlock";
import { replaceChordLineLyrics } from "common/ChordModel/ChordLinePatcher";
import { Collection, CollectionMethods, IDable } from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";
import { List, Record } from "immutable";

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

export const timeSectionSortFn = (a: TimeSection, b: TimeSection): number => {
    if (a.time < b.time) {
        return -1;
    }

    if (a.time > b.time) {
        return 1;
    }

    return 0;
};

type RecordType = {
    id: string;
    section?: Section;
    elements: Collection<ChordBlock>;
    type: "ChordLine";
};

const DefaultRecord: RecordType = {
    id: "",
    section: undefined,
    elements: new Collection<ChordBlock>(),
    type: "ChordLine",
};

const RecordConstructor = Record(DefaultRecord);
type ChordLineRecord = ReturnType<typeof RecordConstructor>;

type ConstructorParams = {
    blocks?: Collection<ChordBlock> | ChordBlock[];
    section?: Section;
};

export class ChordLine
    extends CollectionMethods<ChordLine, ChordBlock>
    implements IDable<ChordLine>
{
    readonly record: ChordLineRecord;

    constructor(params: ConstructorParams | ChordLineRecord) {
        super();

        if (ChordLine.isChordLineRecord(params)) {
            this.record = params as ChordLineRecord;
            return;
        }

        let elements: Collection<ChordBlock>;

        if (params.blocks === undefined) {
            elements = new Collection([
                new ChordBlock({ chord: "", lyric: new Lyric("") }),
            ]);
        } else {
            if (params.blocks instanceof Collection) {
                elements = params.blocks;
            } else {
                elements = new Collection(params.blocks);
            }
        }

        this.record = RecordConstructor({
            id: shortid.generate(),
            type: "ChordLine",
            section: params.section,
            elements: elements,
        });
    }

    static isChordLineRecord(
        params: ConstructorParams | ChordLineRecord
    ): params is ChordLineRecord {
        return Record.isRecord(params);
    }

    toJSON(): object {
        const plainObject = this.record.toJSON();
        return lodash.omit(plainObject, "id");
    }

    // for copying purposes, the section is usually not
    // intended to be pasted elsewhere
    forCopying(): ChordLine {
        return this.set("section", undefined);
    }

    private new(maybeNew: ChordLineRecord): ChordLine {
        if (maybeNew === this.record) {
            return this;
        }

        return new ChordLine(maybeNew);
    }

    get id(): string {
        return this.record.id;
    }

    get type(): "ChordLine" {
        return this.record.type;
    }

    get section(): Section | undefined {
        return this.record.section;
    }

    protected get elements(): Collection<ChordBlock> {
        return this.record.elements;
    }

    updateCollection(
        updater: (collection: Collection<ChordBlock>) => Collection<ChordBlock>
    ): ChordLine {
        return this.update("elements", updater);
    }

    set<K extends keyof RecordType>(key: K, value: RecordType[K]): ChordLine {
        const newRecord = this.record.set(key, value);
        return this.new(newRecord);
    }

    update<K extends keyof RecordType>(
        key: K,
        updater: (value: RecordType[K]) => RecordType[K]
    ): ChordLine {
        const newRecord = this.record.update(key, updater);
        return this.new(newRecord);
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

        return new ChordLine({
            blocks: new Collection(chordBlockElems),
            section: section,
        });
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

        return new ChordLine({
            blocks: new Collection([block]),
        });
    }

    get chordBlocks(): Collection<ChordBlock> {
        return this.elements;
    }

    get lyrics(): Lyric {
        const lyricTokens: List<Lyric> = this.chordBlocks.list.map(
            (chordBlock: ChordBlock): Lyric => chordBlock.lyric
        );

        return Lyric.join(lyricTokens, "");
    }

    replaceLyrics(newLyrics: Lyric): ChordLine {
        if (this.lyrics.isEqual(newLyrics)) {
            return this;
        }

        return replaceChordLineLyrics(this, newLyrics);
    }

    setChord(idable: IDable<ChordBlock>, newChord: string): ChordLine {
        const newChordLine = this.replaceElement(idable, (block) => {
            return block.set("chord", newChord);
        });

        return newChordLine.normalizeBlocks();
    }

    removeSectionName(): [ChordLine, boolean] {
        if (this.section === undefined) {
            return [this, false];
        }

        return [this.set("section", undefined), true];
    }

    setSectionName(newName: string): [ChordLine, boolean] {
        if (newName === "") {
            return this.removeSectionName();
        }

        if (this.section === undefined) {
            return [
                this.set("section", {
                    type: "label",
                    name: newName,
                }),
                true,
            ];
        }

        const withUpdatedSection = this.update(
            "section",
            (section: Section | undefined): Section => {
                if (section === undefined) {
                    throw new Error("Impossible");
                }

                return {
                    ...section,
                    name: newName,
                };
            }
        );

        return [withUpdatedSection, true];
    }

    removeSectionTime(): [ChordLine, boolean] {
        if (this.section === undefined) {
            return [this, false];
        }

        return [
            this.set("section", {
                type: "label",
                name: this.section.name,
            }),
            true,
        ];
    }

    setSectionTime(newTime: number | null): [ChordLine, boolean] {
        if (newTime === null) {
            return this.removeSectionTime();
        }

        const name = this.section !== undefined ? this.section.name : "";

        return [
            this.set("section", {
                type: "time",
                name: name,
                time: newTime,
            }),
            true,
        ];
    }

    splitBlock(idable: IDable<ChordBlock>, splitIndex: number): ChordLine {
        const block = this.elements.get(idable);

        const [newPrevBlock, newCurrBlock] =
            block.splitByTokenIndex(splitIndex);

        return this.updateCollection((elements) => {
            return elements.splice(idable, 1, newPrevBlock, newCurrBlock);
        });
    }

    splitByCharIndex(splitIndex: number): [ChordLine, ChordLine] {
        const splitAtBeginning = splitIndex === 0;
        if (splitAtBeginning) {
            const nextLine = new ChordLine({
                blocks: this.chordBlocks,
            });

            const newCurrLine = this.updateCollection(
                () =>
                    new Collection([
                        new ChordBlock({ chord: "", lyric: new Lyric("") }),
                    ])
            );

            return [newCurrLine, nextLine];
        }

        const totalLyricLength = this.lyrics.get((s: string) => s).length;
        const splitAtEnd = splitIndex >= totalLyricLength;
        if (splitAtEnd) {
            return [this, new ChordLine({})];
        }

        // split in the middle otherwise

        const [splitCharIndex, blockIndex] = (() => {
            let remainingChars = splitIndex;

            for (let i = 0; i < this.elements.length; i++) {
                const block = this.elements.getAtIndex(i);
                const lyricLength = block.lyricLength();

                if (remainingChars - lyricLength >= 0) {
                    remainingChars -= lyricLength;
                    continue;
                }

                return [remainingChars, i];
            }

            throw new Error(
                "Unexpected: shouldn't have walked this many characters"
            );
        })();

        let blocksOfCurrLine = this.elements.transform((list) =>
            list.slice(0, blockIndex)
        );
        let blocksOfNextLine = new Collection<ChordBlock>();
        if (splitCharIndex > 0) {
            const block = this.elements.getAtIndex(blockIndex);

            const [firstHalfBlock, secondHalfBlock] =
                block.splitByCharIndex(splitCharIndex);

            blocksOfCurrLine = blocksOfCurrLine.transform((list) =>
                list.push(firstHalfBlock)
            );
            blocksOfNextLine = blocksOfNextLine.transform((list) =>
                list.push(secondHalfBlock)
            );

            const remainingBlocks = this.elements.transform((list) =>
                list.slice(blockIndex + 1)
            );
            blocksOfNextLine = blocksOfNextLine.transform((list) =>
                list.push(...remainingBlocks.toArray())
            );
        } else {
            blocksOfNextLine = this.elements.transform((list) =>
                list.slice(blockIndex)
            );
        }

        const newCurrLine = this.set("elements", blocksOfCurrLine);
        const nextLine = new ChordLine({ blocks: blocksOfNextLine });

        return [newCurrLine, nextLine];
    }

    // passes through every block to ensure that blocks without chords exist (except for the first)
    normalizeBlocks(): ChordLine {
        const newBlocks: ChordBlock[] = [];

        this.elements.forEach((block: ChordBlock) => {
            const hasLastBlock = newBlocks.length > 0;
            const shouldMergeWithLastBlock = block.chord === "" && hasLastBlock;

            if (shouldMergeWithLastBlock) {
                const lastIndex = newBlocks.length - 1;
                newBlocks[lastIndex] = newBlocks[lastIndex].update(
                    "lyric",
                    (lyric: Lyric) => {
                        return lyric.append(block.lyric);
                    }
                );
            } else {
                newBlocks.push(block);
            }
        });

        // avoid rejiggering the data if it's a no-op
        if (newBlocks.length === this.elements.length) {
            return this;
        }

        return this.set("elements", new Collection(newBlocks));
    }

    contentEquals(other: ChordLine): boolean {
        if (this.chordBlocks.length !== other.chordBlocks.length) {
            return false;
        }

        if (!lodash.isEqual(this.section, other.section)) {
            return false;
        }

        let blocksAreEqual = true;
        this.chordBlocks.forEach(
            (block: ChordBlock, index: number): void | false => {
                const otherBlock = other.chordBlocks.getAtIndex(index);
                if (!block.contentEquals(otherBlock)) {
                    blocksAreEqual = false;
                    return false;
                }
            }
        );

        return blocksAreEqual;
    }

    isEmpty(): boolean {
        if (this.chordBlocks.length > 1) {
            return false;
        }

        if (this.chordBlocks.length === 0) {
            return true;
        }

        return this.chordBlocks.getAtIndex(0).isEmpty();
    }

    hasSection(): boolean {
        return this.section !== undefined;
    }
}
