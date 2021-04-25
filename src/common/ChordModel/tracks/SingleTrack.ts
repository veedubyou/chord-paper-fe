import * as iots from "io-ts";
import { BaseTrackValidator, validateValue } from "./BaseTrack";

export const SingleTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.literal("single"),
        url: iots.string,
    }),
]);

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
