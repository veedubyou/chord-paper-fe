import { BaseTrackValidator, validateValue } from "common/ChordModel/tracks/BaseTrack";
import { Record } from "immutable";
import * as iots from "io-ts";

export const SingleTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.literal("single"),
        url: iots.string,
    }),
]);

type SingleTrackValidatedFields = iots.TypeOf<typeof SingleTrackValidator>;
const DefaultSingleTrackRecord = {
    id: "",
    track_type: "single" as "single",
    label: "",
    url: "",
};

export class SingleTrack
    extends Record(DefaultSingleTrackRecord)
    implements SingleTrackValidatedFields
{
    constructor(id: string, label: string, url: string) {
        super({
            id: id,
            track_type: "single",
            label: label,
            url: url,
        });
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
