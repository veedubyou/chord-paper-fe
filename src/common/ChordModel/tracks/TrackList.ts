import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { SingleTrack } from "./SingleTrack";
import { FourStemTrack, TwoStemTrack } from "./StemTrack";
import { Track, TrackValidator } from "./Track";

const TrackListValidator = iots.type({
    song_id: iots.string,
    tracks: iots.array(TrackValidator),
});

type TrackListValidatedFields = iots.TypeOf<typeof TrackListValidator>;
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
        const deserializeTrack = (
            validatedFields: iots.TypeOf<typeof TrackValidator>
        ): Track => {
            switch (validatedFields.track_type) {
                case "single": {
                    return SingleTrack.fromValidatedFields(validatedFields);
                }

                case "2stems": {
                    return TwoStemTrack.fromValidatedFields(validatedFields);
                }

                case "4stems": {
                    return FourStemTrack.fromValidatedFields(validatedFields);
                }
            }
        };

        const tracks: Track[] = validatedFields.tracks.map(deserializeTrack);
        return new TrackList(validatedFields.song_id, tracks);
    }

    static fromJSONObject(jsonObj: unknown): Either<Error, TrackList> {
        const validationResult = TrackListValidator.decode(jsonObj);

        if (isLeft(validationResult)) {
            return left(new Error("Invalid Chord Song object"));
        }

        return right(this.fromValidatedFields(validationResult.right));
    }
}
