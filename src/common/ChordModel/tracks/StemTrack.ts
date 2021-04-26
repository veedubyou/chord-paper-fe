import * as iots from "io-ts";
import { mapObject } from "../../mapObject";
import { BaseTrackValidator, validateValue } from "./BaseTrack";

const makeStemTrackValidator = <T extends object, S extends string>(
    emptyKeyMap: T,
    trackType: S
) => {
    const stringTypes = mapObject(emptyKeyMap, () => iots.string);

    return iots.intersection([
        BaseTrackValidator,
        iots.type({
            track_type: iots.literal(trackType),
            stem_urls: iots.type(stringTypes),
        }),
    ]);
};

type StemURLs<StemKey extends string> = {
    [P in StemKey]: string;
};

export abstract class StemTrack<StemKey extends string> {
    id: string;
    label: string;
    stem_urls: StemURLs<StemKey>;

    constructor(id: string, label: string, stems_urls: StemURLs<StemKey>) {
        this.id = id;
        this.label = label;
        this.stem_urls = stems_urls;
    }

    abstract keyObject(): Record<StemKey, undefined>;

    validate(): boolean {
        if (!validateValue(this.label)) {
            return false;
        }

        let key: StemKey;
        for (key in this.stem_urls) {
            if (!validateValue(this.stem_urls[key])) {
                return false;
            }
        }

        return true;
    }
}

// Two stems
const TwoStemEmptyObject = {
    accompaniment: undefined,
    vocals: undefined,
};

export type TwoStemKeys = keyof typeof TwoStemEmptyObject;
export const TwoStemTrackValidator = makeStemTrackValidator(
    TwoStemEmptyObject,
    "2stems"
);

type TwoStemTrackValidatedFields = iots.TypeOf<typeof TwoStemTrackValidator>;

export class TwoStemTrack extends StemTrack<TwoStemKeys>
    implements TwoStemTrackValidatedFields {
    track_type: "2stems";

    constructor(id: string, label: string, stem_urls: StemURLs<TwoStemKeys>) {
        super(id, label, stem_urls);
        this.track_type = "2stems";
    }

    keyObject(): Record<TwoStemKeys, undefined> {
        return TwoStemEmptyObject;
    }

    static fromValidatedFields(
        validatedFields: TwoStemTrackValidatedFields
    ): TwoStemTrack {
        return new TwoStemTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.stem_urls
        );
    }
}

// Four stems
const FourStemEmptyObject = {
    bass: undefined,
    drums: undefined,
    other: undefined,
    vocals: undefined,
};

export type FourStemKeys = keyof typeof FourStemEmptyObject;
export const FourStemTrackValidator = makeStemTrackValidator(
    FourStemEmptyObject,
    "4stems"
);

type FourStemTrackValidatedFields = iots.TypeOf<typeof FourStemTrackValidator>;

export class FourStemTrack extends StemTrack<FourStemKeys>
    implements FourStemTrackValidatedFields {
    track_type: "4stems";

    constructor(id: string, label: string, stem_urls: StemURLs<FourStemKeys>) {
        super(id, label, stem_urls);
        this.track_type = "4stems";
    }

    keyObject(): Record<FourStemKeys, undefined> {
        return FourStemEmptyObject;
    }

    static fromValidatedFields(
        validatedFields: FourStemTrackValidatedFields
    ): FourStemTrack {
        return new FourStemTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.stem_urls
        );
    }
}
