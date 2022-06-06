import { SingleTrack } from "common/ChordModel/tracks/SingleTrack";
import { SplitStemTrack } from "common/ChordModel/tracks/SplitStemRequest";
import { FiveStemTrack, FourStemTrack, TwoStemTrack } from "common/ChordModel/tracks/StemTrack";
import { Track, TrackValidator } from "common/ChordModel/tracks/Track";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";

const TrackListValidator = iots.type({
    song_id: iots.string,
    tracks: iots.array(TrackValidator),
});

type TrackListValidatedFields = iots.TypeOf<typeof TrackListValidator>;
export class TrackList implements TrackListValidatedFields {
    readonly song_id: string;
    readonly tracks: Track[];

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

                case "5stems": {
                    return FiveStemTrack.fromValidatedFields(validatedFields);
                }

                case "split_2stems":
                case "split_4stems":
                case "split_5stems": {
                    return SplitStemTrack.fromValidatedFields(validatedFields);
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
