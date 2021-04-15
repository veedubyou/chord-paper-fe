import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";

const validateValue = (value: string): boolean => {
    return value.trim() !== "";
};

const BaseTrackValidator = iots.type({
    id: iots.string,
    label: iots.string,
});

const SingleTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.literal("single"),
        url: iots.string,
    }),
]);

const FourStemsValidator = iots.type({
    vocals_url: iots.string,
    other_url: iots.string,
    bass_url: iots.string,
    drums_url: iots.string,
});

const FourStemsTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.literal("4stems"),
        stems: FourStemsValidator,
    }),
]);

const TrackValidator = iots.union([
    SingleTrackValidator,
    FourStemsTrackValidator,
]);

const TrackListValidator = iots.type({
    song_id: iots.string,
    tracks: iots.array(TrackValidator),
});

type SingleTrackValidatedFields = iots.TypeOf<typeof SingleTrackValidator>;
export class SingleTrack implements SingleTrackValidatedFields {
    id: string;
    track_type: "single";
    label: string;
    url: string;

    constructor(id: string, label: string, url: string) {
        this.id = id;
        this.track_type = "single";
        this.label = label;
        this.url = url;
    }

    static fromValidatedFields(
        validatedFields: SingleTrackValidatedFields
    ): SingleTrack {
        return new SingleTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.url
        );
    }

    validate(): boolean {
        return validateValue(this.label) && validateValue(this.url);
    }
}

type FourStemsValidatedFields = iots.TypeOf<typeof FourStemsValidator>;
type FourStemsTrackValidatedFields = iots.TypeOf<
    typeof FourStemsTrackValidator
>;

export class FourStemsTrack implements FourStemsTrackValidatedFields {
    id: string;
    track_type: "4stems";
    label: string;
    stems: FourStemsValidatedFields;

    constructor(id: string, label: string, stems: FourStemsValidatedFields) {
        this.id = id;
        this.track_type = "4stems";
        this.label = label;
        this.stems = stems;
    }

    static fromValidatedFields(
        validatedFields: FourStemsTrackValidatedFields
    ): FourStemsTrack {
        return new FourStemsTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.stems
        );
    }

    validate(): boolean {
        if (!validateValue(this.label)) {
            return false;
        }

        if (!validateValue(this.stems.bass_url)) {
            return false;
        }

        if (!validateValue(this.stems.drums_url)) {
            return false;
        }

        if (!validateValue(this.stems.other_url)) {
            return false;
        }

        if (!validateValue(this.stems.vocals_url)) {
            return false;
        }
        return true;
    }
}

export type Track = SingleTrack | FourStemsTrack;

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

                case "4stems": {
                    return FourStemsTrack.fromValidatedFields(validatedFields);
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
