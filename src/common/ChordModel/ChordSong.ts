import * as iots from "io-ts";
import { Collection, stringifyIgnoreID } from "./Collection";
import { Either, right, left, isLeft, parseJSON } from "fp-ts/lib/Either";
import {
    ChordLineValidator,
    ChordLineValidatedFields,
    ChordLine,
} from "./ChordLine";

const SongMetadataValidator = iots.type({
    title: iots.string,
    composedBy: iots.string,
    performedBy: iots.string,
    asHeardFrom: iots.string,
});

type SongMetadata = iots.TypeOf<typeof SongMetadataValidator>;

const ChordSongValidator = iots.type({
    elements: iots.array(ChordLineValidator),
    metadata: SongMetadataValidator,
});
type ChordSongValidatedFields = iots.TypeOf<typeof ChordSongValidator>;

export class ChordSong extends Collection<ChordLine, "ChordLine"> {
    metadata: SongMetadata;

    constructor(elements?: ChordLine[], metadata?: SongMetadata) {
        if (elements === undefined) {
            elements = [new ChordLine()];
        }

        super(elements);

        if (metadata !== undefined) {
            this.metadata = metadata;
        } else {
            this.metadata = {
                title: "",
                composedBy: "",
                performedBy: "",
                asHeardFrom: "",
            };
        }
    }

    static fromValidatedFields(
        validatedFields: ChordSongValidatedFields
    ): ChordSong {
        const chordLines: ChordLine[] = validatedFields.elements.map(
            (chordLineValidatedFields: ChordLineValidatedFields) => {
                return ChordLine.fromValidatedFields(chordLineValidatedFields);
            }
        );
        return new ChordSong(chordLines, validatedFields.metadata);
    }

    serialize(): string {
        return stringifyIgnoreID(this);
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
        const validationResult = ChordSongValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Song object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
    }

    static fromLyricsLines(lyricLines: string[]): ChordSong {
        const chordLines: ChordLine[] = lyricLines.map((lyricLine: string) =>
            ChordLine.fromLyrics(lyricLine)
        );
        return new ChordSong(chordLines);
    }

    get chordLines(): ChordLine[] {
        return this.elements;
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
        return new ChordSong(this.elements, this.metadata);
    }
}
