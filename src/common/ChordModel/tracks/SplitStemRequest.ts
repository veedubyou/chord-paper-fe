import * as iots from "io-ts";
import { BaseTrackValidator, validateValue } from "./BaseTrack";
import { Record } from "immutable";

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

const DefaultSplitStemTrackRecord = {
    id: "",
    track_type: "split_2stems" as SplitStemTypes,
    label: "",
    original_url: "",
};

export class SplitStemTrack
    extends Record(DefaultSplitStemTrackRecord)
    implements SplitStemTrackValidatedFields
{
    constructor(
        id: string,
        label: string,
        splitType: SplitStemTypes,
        originalURL: string
    ) {
        super({
            id: id,
            track_type: splitType,
            label: label,
            original_url: originalURL,
        });
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
