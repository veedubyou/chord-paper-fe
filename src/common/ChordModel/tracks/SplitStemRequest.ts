import {
    BaseTrackValidator,
    validateValue,
} from "common/ChordModel/tracks/BaseTrack";
import { Record } from "immutable";
import * as iots from "io-ts";

export const SplitStemTrackValidator = iots.intersection([
    BaseTrackValidator,
    iots.type({
        engine_type: iots.union([
            iots.literal("spleeter"),
            iots.literal("demucs"),
            iots.literal("demucs-v3"),
        ]),
        track_type: iots.union([
            iots.literal("split_2stems"),
            iots.literal("split_4stems"),
            iots.literal("split_5stems"),
        ]),
        original_url: iots.string,
        job_status: iots.union([
            iots.literal("requested"),
            iots.literal("processing"),
            iots.literal("error"),
        ]),
        job_status_message: iots.string,
        job_status_debug_log: iots.string,
        job_progress: iots.number,
    }),
]);

type SplitStemTrackValidatedFields = iots.TypeOf<
    typeof SplitStemTrackValidator
>;

export type SplitEngineTypes = "spleeter" | "demucs" | "demucs-v3";
export type SplitStemTypes = "split_2stems" | "split_4stems" | "split_5stems";
export type SplitStemJobStatus = "requested" | "processing" | "error";

const DefaultSplitStemTrackRecord = {
    id: "",
    track_type: "split_4stems" as SplitStemTypes,
    engine_type: "spleeter" as SplitEngineTypes,
    label: "",
    original_url: "",
    job_status: "requested" as SplitStemJobStatus,
    job_status_message: "",
    job_status_debug_log: "",
    job_progress: 0,
};

export class SplitStemTrack
    extends Record(DefaultSplitStemTrackRecord)
    implements SplitStemTrackValidatedFields
{
    constructor(
        id: string,
        label: string,
        splitType: SplitStemTypes,
        engineType: SplitEngineTypes,
        originalURL: string,
        jobStatus: SplitStemJobStatus,
        jobStatusMessage: string,
        jobProgress: number,
        jobStatusDebugLog: string
    ) {
        super({
            id: id,
            track_type: splitType,
            engine_type: engineType,
            label: label,
            original_url: originalURL,
            job_status: jobStatus,
            job_status_message: jobStatusMessage,
            job_progress: jobProgress,
            job_status_debug_log: jobStatusDebugLog,
        });
    }

    static newTrackRequest(): SplitStemTrack {
        return new SplitStemTrack(
            "",
            "",
            "split_4stems",
            "demucs",
            "",
            "requested",
            "",
            0,
            ""
        );
    }

    static fromValidatedFields(
        validatedFields: SplitStemTrackValidatedFields
    ): SplitStemTrack {
        return new SplitStemTrack(
            validatedFields.id,
            validatedFields.label,
            validatedFields.track_type,
            validatedFields.engine_type,
            validatedFields.original_url,
            validatedFields.job_status,
            validatedFields.job_status_message,
            validatedFields.job_progress,
            validatedFields.job_status_debug_log
        );
    }

    validate(): boolean {
        return (
            validateValue(this.label) &&
            validateValue(this.original_url) &&
            validateValue(this.track_type) &&
            validateValue(this.engine_type)
        );
    }

    setTrackType(trackType: SplitStemTypes): SplitStemTrack {
        const modified = this.set("track_type", trackType);
        return modified.set("label", modified.derivedLabel());
    }

    setEngineType(engineType: SplitEngineTypes) {
        let modified = this.set("engine_type", engineType);

        const stemCountUnavailable =
            engineType !== "spleeter" && modified.track_type === "split_5stems";
        if (stemCountUnavailable) {
            modified = modified.set("track_type", "split_4stems");
        }

        return modified.set("label", modified.derivedLabel());
    }

    private derivedLabel(): string {
        let stemCount: string;
        switch (this.track_type) {
            case "split_2stems": {
                stemCount = "2 stems";
                break;
            }
            case "split_4stems": {
                stemCount = "4 stems";
                break;
            }
            case "split_5stems": {
                stemCount = "5 stems";
                break;
            }
        }

        let engine: string;
        switch (this.engine_type) {
            case "spleeter": {
                engine = "spleeter";
                break;
            }

            case "demucs": {
                engine = "demucs";
                break;
            }

            case "demucs-v3": {
                engine = "demucs v3";
                break;
            }
        }

        return `${stemCount} (${engine})`;
    }
}
