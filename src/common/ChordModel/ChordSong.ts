import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { Json, parse } from "fp-ts/Json";
import * as iots from "io-ts";
import { DateFromISOString } from "io-ts-types";
import lodash from "lodash";
import { User } from "components/user/userContext";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import {
    ChordLine,
    ChordLineValidatedFields,
    ChordLineValidator,
    TimeSection,
    timeSectionSortFn,
} from "common/ChordModel/ChordLine";
import { Collection, CollectionMethods, IDable } from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";
import { List, Record } from "immutable";
import { Note } from "common/music/foundation/Note";
import { transposeSong } from "common/music/transpose/Transpose";

const MetadataValidator = iots.type({
    title: iots.string,
    composedBy: iots.string,
    performedBy: iots.string,
});

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

    get timeSections(): List<TimeSection> {
        const timeSections: TimeSection[] = [];

        this.chordLines.forEach((line: ChordLine) => {
            if (line.section?.type === "time") {
                timeSections.push(line.section);
            }
        });

        timeSections.sort(timeSectionSortFn);
        return List(timeSections);
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
        return transposeSong(this, fromKey, toKey);
    }
}
