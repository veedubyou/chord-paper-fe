import { ChordBlock } from "common/ChordModel/ChordBlock";
import {
    ChordLine,
    ChordLineValidatedFields,
    ChordLineValidator,
    TimestampedSection,
} from "common/ChordModel/ChordLine";
import {
    Collection,
    CollectionMethods,
    IDable,
} from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";
import { Note } from "common/music/foundation/Note";
import { transposeSong } from "common/music/transpose/Transpose";
import { User } from "components/user/userContext";
import { Json, parse } from "fp-ts/Json";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { List, Record } from "immutable";
import * as iots from "io-ts";
import { DateFromISOString } from "io-ts-types";
import lodash from "lodash";

const RequiredMetadataValidator = iots.type({
    title: iots.string,
    composedBy: iots.string,
    performedBy: iots.string,
});

// not great to duplicate, but at least it's easily readable and hard to get wrong
const NoteValidator = iots.union([
    iots.literal("C"),
    iots.literal("C#"),
    iots.literal("Cb"),
    iots.literal("D"),
    iots.literal("D#"),
    iots.literal("Db"),
    iots.literal("E"),
    iots.literal("E#"),
    iots.literal("Eb"),
    iots.literal("F"),
    iots.literal("F#"),
    iots.literal("Fb"),
    iots.literal("G"),
    iots.literal("G#"),
    iots.literal("Gb"),
    iots.literal("A"),
    iots.literal("A#"),
    iots.literal("Ab"),
    iots.literal("B"),
    iots.literal("B#"),
    iots.literal("Bb"),
]);

// this is meant to be nested one more level in inside a transpose object
// but the serde library vomits when it's nested.
// working to migrate the backend to an ecosystem that doesn't suck
// then these can be migrated inside another object
// but until then, they are top level in metadata
const OptionalMetadataValidator = iots.partial({
    originalKey: NoteValidator,
    currentKey: NoteValidator,
});

const MetadataValidator = iots.intersection([
    RequiredMetadataValidator,
    OptionalMetadataValidator,
]);

type Metadata = iots.TypeOf<typeof MetadataValidator>;

const SongSummaryTypes = {
    id: iots.string,
    owner: iots.string,
    lastSavedAt: iots.union([DateFromISOString, iots.null]),
    metadata: MetadataValidator,
};

const SongSummaryValidator = iots.type(SongSummaryTypes);

const ListSongSummaryValidator = iots.array(SongSummaryValidator);

type SongSummaryValidatedFields = iots.TypeOf<typeof SongSummaryValidator>;

export class SongSummary implements SongSummaryValidatedFields {
    id: string;
    owner: string;
    lastSavedAt: Date | null;
    metadata: Metadata;

    constructor(fields?: SongSummaryValidatedFields) {
        if (fields === undefined) {
            this.id = "";
            this.owner = "";
            this.metadata = {
                title: "",
                composedBy: "",
                performedBy: "",
                originalKey: undefined,
                currentKey: undefined,
            };
            this.lastSavedAt = null;
            return;
        }

        this.id = fields.id;
        this.owner = fields.owner;
        this.metadata = fields.metadata;
        this.lastSavedAt = fields.lastSavedAt;
    }

    static fromJSONObject(jsonObj: unknown): Either<Error, SongSummary> {
        const validationResult = SongSummaryValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Song Summary object"));
        }

        return right(new SongSummary({ ...validationResult.right }));
    }

    static fromJSONList(jsonList: unknown): Either<Error, SongSummary[]> {
        const validationResult = ListSongSummaryValidator.decode(jsonList);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Song Summary list"));
        }

        const songSummaryList: SongSummary[] = validationResult.right.map(
            (fields: SongSummaryValidatedFields): SongSummary => {
                return new SongSummary({ ...fields });
            }
        );

        return right(songSummaryList);
    }
}

const ChordSongValidator = iots.type({
    ...SongSummaryTypes,
    elements: iots.array(ChordLineValidator),
});

type ChordSongValidatedFields = iots.TypeOf<typeof ChordSongValidator>;

type RecordType = {
    id: string;
    owner: string;
    lastSavedAt: Date | null;
    metadata: Metadata;
    elements: Collection<ChordLine>;
};

const DefaultRecord: RecordType = {
    id: "",
    owner: "",
    lastSavedAt: null,
    metadata: {
        title: "",
        composedBy: "",
        performedBy: "",
        originalKey: undefined,
        currentKey: undefined,
    },
    elements: new Collection<ChordLine>(),
};

const RecordConstructor = Record(DefaultRecord);
type ChordSongRecord = ReturnType<typeof RecordConstructor>;

type ConstructorParams = {
    lines?: Collection<ChordLine> | ChordLine[];
    fields?: SongSummaryValidatedFields;
};

export class ChordSong
    extends CollectionMethods<ChordSong, ChordLine>
    implements SongSummaryValidatedFields
{
    readonly record: ChordSongRecord;

    constructor(params: ConstructorParams | ChordSongRecord) {
        super();

        if (ChordSong.isChordSongRecord(params)) {
            this.record = params as ChordSongRecord;
            return;
        }

        const record: RecordType = {
            ...DefaultRecord,
            metadata: { ...DefaultRecord.metadata },
        };

        if (params.lines === undefined) {
            record.elements = new Collection([new ChordLine({})]);
        } else {
            if (params.lines instanceof Collection) {
                record.elements = params.lines;
            } else {
                record.elements = new Collection(params.lines);
            }
        }

        if (params.fields !== undefined) {
            record.id = params.fields.id;
            record.owner = params.fields.owner;
            record.metadata = params.fields.metadata;
            record.lastSavedAt = params.fields.lastSavedAt;
        }

        this.record = RecordConstructor(record);
    }

    static isChordSongRecord(
        params: ConstructorParams | ChordSongRecord
    ): params is ChordSongRecord {
        return Record.isRecord(params);
    }

    toJSON(): object {
        return this.record.toJSON();
    }

    private new(maybeNew: ChordSongRecord): ChordSong {
        if (maybeNew === this.record) {
            return this;
        }

        return new ChordSong(maybeNew);
    }

    get id(): string {
        return this.record.id;
    }

    get owner(): string {
        return this.record.owner;
    }

    get metadata(): Metadata {
        return this.record.metadata;
    }

    get lastSavedAt(): Date | null {
        return this.record.lastSavedAt;
    }

    get originalKey(): Note | null {
        return this.record.metadata.originalKey ?? null;
    }

    get currentKey(): Note | null {
        return this.record.metadata.currentKey ?? null;
    }

    protected get elements(): Collection<ChordLine> {
        return this.record.elements;
    }

    updateCollection(
        updater: (collection: Collection<ChordLine>) => Collection<ChordLine>
    ): ChordSong {
        return this.update("elements", updater);
    }

    set<K extends keyof RecordType>(key: K, value: RecordType[K]): ChordSong {
        const newRecord = this.record.set(key, value);
        return this.new(newRecord);
    }

    update<K extends keyof RecordType>(
        key: K,
        updater: (value: RecordType[K]) => RecordType[K]
    ): ChordSong {
        const newRecord = this.record.update(key, updater);
        return this.new(newRecord);
    }

    static fromValidatedFields(
        validatedFields: ChordSongValidatedFields
    ): ChordSong {
        const chordLines: ChordLine[] = validatedFields.elements.map(
            (chordLineValidatedFields: ChordLineValidatedFields) => {
                return ChordLine.fromValidatedFields(chordLineValidatedFields);
            }
        );

        return new ChordSong({
            lines: new Collection(chordLines),
            fields: validatedFields,
        });
    }

    static deserialize(jsonStr: string): Either<Error, ChordSong> {
        const result: Either<unknown, Json> = parse(jsonStr);

        if (isLeft(result)) {
            return left(new Error(JSON.stringify(result.left)));
        }

        const jsonObj = result.right;
        return ChordSong.fromJSONObject(jsonObj);
    }

    static fromJSONObject(jsonObj: unknown): Either<Error, ChordSong> {
        const validationResult = ChordSongValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Song object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
    }

    static fromLyricsLines(lyricLines: Lyric[]): ChordSong {
        const chordLines: ChordLine[] = lyricLines.map((lyricLine: Lyric) =>
            ChordLine.fromLyrics(lyricLine)
        );

        const params: ConstructorParams = {
            lines: new Collection(chordLines),
        };

        return new ChordSong(params);
    }

    get chordLines(): Collection<ChordLine> {
        return this.elements;
    }

    get timeSectionedChordLines(): List<List<ChordLine>> {
        let allSections: List<List<ChordLine>> = List();
        let currentSection: ChordLine[] = [];

        this.chordLines.forEach((line: ChordLine) => {
            const beginningOfNewSection = line.section?.type === "time";
            if (beginningOfNewSection) {
                const currentSectionHasContent = currentSection.length > 0;
                if (currentSectionHasContent) {
                    allSections = allSections.push(List(currentSection));
                }

                currentSection = [];
            }

            currentSection.push(line);
        });

        const currentSectionHasContent = currentSection.length > 0;
        if (currentSectionHasContent) {
            allSections = allSections.push(List(currentSection));
        }

        return allSections;
    }

    get timestampedSections(): List<TimestampedSection> {
        const timestampedSections: TimestampedSection[] = [];

        this.chordLines.forEach((line: ChordLine) => {
            if (line.section?.type === "time") {
                timestampedSections.push({
                    ...line.section,
                    lineID: line.id,
                });
            }
        });

        return List(timestampedSections);
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

    get(idable: IDable<ChordLine>): ChordLine {
        return this.chordLines.get(idable);
    }

    // fork clones only the contents of the song, not the ownership information
    // i.e. not ID, not owner ID, not last saved, etc
    fork(): ChordSong {
        const clone = this.set("id", "")
            .set("owner", "")
            .set("lastSavedAt", null);

        return clone;
    }

    isUnsaved(): boolean {
        return this.id === "";
    }

    isOwner(user: User | null): boolean {
        if (this.owner === "") {
            return false;
        }

        if (user === null) {
            return false;
        }

        return this.owner === user.userID;
    }

    mergeLineWithPrevious(idable: IDable<ChordLine>): [ChordSong, boolean] {
        const currIndex = this.chordLines.indexOf(idable.id);

        const hasPreviousLine = currIndex > 0;
        // no previous line to merge with, just bail
        if (!hasPreviousLine) {
            return [this, false];
        }

        // the user experience usually would like a space between lines when they're merged
        // e.g.
        // Never Gonna
        // Give You Up
        // =>
        // Never GonnaGive You Up is awkward

        const addSpaceToEndOfLine = (line: ChordLine): ChordLine => {
            const lastBlockIndex = line.chordBlocks.length - 1;

            return line.updateElement(lastBlockIndex, (block) => {
                return block.update("lyric", (lyric) => {
                    return lyric.append(" ");
                });
            });
        };

        const appendLineToPrev = (
            prevLine: ChordLine,
            currLine: ChordLine
        ): ChordLine => {
            return prevLine.updateCollection((elements) => {
                return elements.transform((list) =>
                    list.push(...currLine.chordBlocks.toArray())
                );
            });
        };

        const mergeLines = (
            prevLine: ChordLine,
            currLine: ChordLine
        ): ChordLine => {
            prevLine = addSpaceToEndOfLine(prevLine);
            prevLine = appendLineToPrev(prevLine, currLine);
            prevLine = prevLine.normalizeBlocks();

            return prevLine;
        };

        const newChordSong = this.updateCollection((elements) => {
            const currLine = elements.getAtIndex(currIndex);

            elements = elements.update(currIndex - 1, (prevLine) =>
                mergeLines(prevLine, currLine)
            );

            elements = elements.remove(currLine);

            return elements;
        });

        return [newChordSong, true];
    }

    splitLine(
        idable: IDable<ChordLine>,
        splitIndex: number
    ): [ChordSong, boolean] {
        const chordLine = this.chordLines.get(idable);

        const [newCurrLine, nextLine] = chordLine.splitByCharIndex(splitIndex);

        const newChordSong = this.updateCollection((elements) => {
            return elements.splice(chordLine, 1, newCurrLine, nextLine);
        });

        return [newChordSong, true];
    }

    contentEquals(other: ChordSong): boolean {
        if (this.chordLines.length !== other.chordLines.length) {
            return false;
        }

        if (!lodash.isEqual(this.metadata, other.metadata)) {
            return false;
        }

        let linesAreEqual = true;
        this.chordLines.forEach(
            (line: ChordLine, index: number): void | false => {
                const otherLine = other.chordLines.getAtIndex(index);
                if (!line.contentEquals(otherLine)) {
                    linesAreEqual = false;
                    return false;
                }
            }
        );

        return linesAreEqual;
    }

    findLineWithBlock(blockID: IDable<ChordBlock>): ChordLine {
        const line = this.chordLines.list.find((line): boolean => {
            const blockResult = line.chordBlocks.list.find(
                (block: ChordBlock) => block.id === blockID.id
            );

            return blockResult !== undefined;
        });

        if (line === undefined) {
            throw new Error("BlockID can't be found in the entire song");
        }

        return line;
    }

    transpose(fromKey: Note, toKey: Note): ChordSong {
        const originalKey = this.originalKey;

        const isFirstTransposition = originalKey === null;
        const keyMismatch = this.currentKey !== fromKey;
        const doLossyTranposition = isFirstTransposition || keyMismatch;

        let newSong: ChordSong;
        
        if (doLossyTranposition) {
            newSong = transposeSong(this, fromKey, toKey);
        } else {
            newSong = transposeSong(this, fromKey, originalKey);
            newSong = transposeSong(newSong, originalKey, toKey);
        }

        const newOriginalKey = originalKey ?? fromKey;

        newSong = newSong.update("metadata", (metadata) => ({
            ...metadata,
            originalKey: newOriginalKey,
            currentKey: toKey,
        }));

        return newSong;
    }

    validateTimestampedSections(): Error | null {
        const sections = this.timestampedSections;

        let prevSectionName = "the beginning of the song";
        let prevTime = 0;
        for (const section of sections) {
            if (section.time < prevTime) {
                return new Error(
                    `Section ${section.name} has an earlier timestamp than ${prevSectionName}`
                );
            }

            prevSectionName = section.name;
            prevTime = section.time;
        }

        return null;
    }
}
