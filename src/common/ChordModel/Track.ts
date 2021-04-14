import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";

export const BaseTrackValidator = iots.type({
    id: iots.string,
});

export const SingleTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.literal("single"),
        label: iots.string,
        url: iots.string,
    }),
]);

export const TrackValidator = SingleTrackValidator;

export const TrackListValidator = iots.type({
    song_id: iots.string,
    tracks: iots.array(TrackValidator),
});

export type Track = iots.TypeOf<typeof TrackValidator>;
export type TrackListValidatedFields = iots.TypeOf<typeof TrackListValidator>;

export class TrackList implements TrackListValidatedFields {
    song_id: string;
    tracks: Track[];

    constructor(songID: string, tracks: Track[]) {
        this.song_id = songID;
        this.tracks = tracks;
    }

    static fromValidatedFields(
        validatedFields: TrackListValidatedFields
    ): TrackList {
        return new TrackList(validatedFields.song_id, validatedFields.tracks);
    }

    static fromJSONObject(jsonObj: unknown): Either<Error, TrackList> {
        const validationResult = TrackListValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Song object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
    }
}
