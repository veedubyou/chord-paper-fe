import * as iots from "io-ts";
import { BaseTrackValidator, validateValue } from "./BaseTrack";

export const SplitStemTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        track_type: iots.union([
            iots.literal("split_2stems"),
            iots.literal("split_4stems"),
            iots.literal("split_5stems"),
        ]),
        original_url: iots.string,
    }),
]);

type SplitStemTrackValidatedFields = iots.TypeOf<
    typeof SplitStemTrackValidator
>;

export type SplitStemTypes = "split_2stems" | "split_4stems" | "split_5stems";
export class SplitStemTrack implements SplitStemTrackValidatedFields {
    id: string;
    track_type: SplitStemTypes;
    label: string;
    original_url: string;

    constructor(
        id: string,
        label: string,
        splitType: SplitStemTypes,
        originalURL: string
    ) {
        this.id = id;
        this.track_type = splitType;
        this.label = label;
        this.original_url = originalURL;
    }

    static fromValidatedFields(
        validatedFields: SplitStemTrackValidatedFields
    ): SplitStemTrack {
        return new SplitStemTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.track_type,
            validatedFields.original_url
        );
    }

    validate(): boolean {
        return validateValue(this.label) && validateValue(this.original_url);
    }
}
