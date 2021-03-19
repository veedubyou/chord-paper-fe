import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { DateFromISOString } from "io-ts-types";
import lodash from "lodash";
import { User } from "../../components/user/userContext";
import { ChordBlock } from "./ChordBlock";
import {
    ChordLine,
    ChordLineValidatedFields,
    ChordLineValidator,
    TimeSection,
    timeSectionSortFn,
} from "./ChordLine";
import { Collection, IDable } from "./Collection";
import { Lyric } from "./Lyric";
import { Track, TrackValidator } from "./Track";

const MetadataValidator = iots.type({
    title: iots.string,
    composedBy: iots.string,
    performedBy: iots.string,
    asHeardFrom: iots.string,
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
                asHeardFrom: "",
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

const ChordSongRequiredFields = iots.type({
    ...SongSummaryTypes,
    elements: iots.array(ChordLineValidator),
});

const ChordSongOptionalFields = iots.partial({
    trackList: iots.array(TrackValidator),
});

const ChordSongValidator = iots.intersection([
    ChordSongRequiredFields,
    ChordSongOptionalFields,
]);

type ChordSongValidatedFields = iots.TypeOf<typeof ChordSongValidator>;

export interface ChordSongFields extends SongSummaryValidatedFields {
    trackList: Track[];
}

export class ChordSong extends Collection<ChordLine>
    implements SongSummaryValidatedFields {
    id: string;
    owner: string;
    lastSavedAt: Date | null;
    metadata: Metadata;
    trackList: Track[];

    constructor(input_elements?: ChordLine[], fields?: ChordSongFields) {
        const elements = input_elements ?? [new ChordLine()];

        super(elements);

        if (fields === undefined) {
            this.id = "";
            this.owner = "";
            this.metadata = {
                title: "",
                composedBy: "",
                performedBy: "",
                asHeardFrom: "",
            };
            this.lastSavedAt = null;
            this.trackList = [];
            return;
        }

        this.id = fields.id;
        this.owner = fields.owner;
        this.metadata = fields.metadata;
        this.lastSavedAt = fields.lastSavedAt;
        this.trackList = fields.trackList;
    }

    static fromValidatedFields(
        validatedFields: ChordSongValidatedFields
    ): ChordSong {
        const chordLines: ChordLine[] = validatedFields.elements.map(
            (chordLineValidatedFields: ChordLineValidatedFields) => {
                return ChordLine.fromValidatedFields(chordLineValidatedFields);
            }
        );

        const trackList: Track[] =
            validatedFields.trackList !== undefined
                ? validatedFields.trackList
                : [];

        return new ChordSong(chordLines, {
            ...validatedFields,
            trackList: trackList,
        });
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
        return new ChordSong(chordLines);
    }

    get chordLines(): ChordLine[] {
        return this.elements;
    }

    get timeSections(): TimeSection[] {
        const collectSections = (
            timeSections: TimeSection[],
            line: ChordLine
        ): TimeSection[] => {
            if (line.section?.type === "time") {
                timeSections.push(line.section);
            }

            return timeSections;
        };

        const timeSections = this.elements.reduce(collectSections, []);
        timeSections.sort(timeSectionSortFn);
        return timeSections;
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
        return new ChordSong(this.elements, {
            ...this,
        });
    }

    // deep clone clones only the contents of the song, not the ownership information
    // i.e. not ID, not owner ID, not last saved, etc
    deepClone(): ChordSong {
        const clone = lodash.cloneDeep(this);
        clone.id = "";
        clone.owner = "";
        clone.lastSavedAt = null;
        return clone;
    }

    toJSON(): object {
        return this;
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

    mergeLineWithPrevious(idable: IDable<ChordLine>): boolean {
        const index = this.indexOf(idable.id);
        // no previous line to merge with, just bail
        if (index === 0) {
            return false;
        }

        // the user experience usually would like a space between lines when they're merged
        // e.g.
        // Never Gonna
        // Give You Up
        // =>
        // Never GonnaGive You Up is awkward
        const prevLine = this.chordLines[index - 1];
        const lastBlockIndex = prevLine.chordBlocks.length - 1;
        prevLine.chordBlocks[lastBlockIndex].lyric.append(new Lyric(" "));

        const currLine = this.chordLines[index];
        prevLine.chordBlocks.push(...currLine.chordBlocks);
        prevLine.normalizeBlocks();

        this.chordLines.splice(index, 1);

        return true;
    }

    contentEquals(other: ChordSong): boolean {
        if (this.chordLines.length !== other.chordLines.length) {
            return false;
        }

        if (!lodash.isEqual(this.metadata, other.metadata)) {
            return false;
        }

        if (!lodash.isEqual(this.trackList, other.trackList)) {
            return false;
        }

        const reducer = (
            isEqual: boolean,
            value: ChordLine,
            index: number
        ): boolean => {
            if (!isEqual) {
                return false;
            }

            const otherLine = other.chordLines[index];
            if (!value.contentEquals(otherLine)) {
                return false;
            }

            return true;
        };

        return this.chordLines.reduce(reducer, true);
    }

    findLineAndBlock(blockID: IDable<ChordBlock>): [ChordLine, ChordBlock] {
        for (const line of this.chordLines) {
            const block: ChordBlock | undefined = line.chordBlocks.find(
                (block: ChordBlock) => block.id === blockID.id
            );
            if (block !== undefined) {
                return [line, block];
            }
        }

        throw new Error("BlockID can't be found in the entire song");
    }
}
