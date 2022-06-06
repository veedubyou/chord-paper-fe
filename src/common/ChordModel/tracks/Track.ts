import { SingleTrack, SingleTrackValidator } from "common/ChordModel/tracks/SingleTrack";
import { SplitStemTrack, SplitStemTrackValidator } from "common/ChordModel/tracks/SplitStemRequest";
import {
    FiveStemTrack,
    FiveStemTrackValidator,
    FourStemTrack,
    FourStemTrackValidator,
    TwoStemTrack,
    TwoStemTrackValidator
} from "common/ChordModel/tracks/StemTrack";
import * as iots from "io-ts";

export const TrackValidator = iots.union([
    SingleTrackValidator,
    TwoStemTrackValidator,
    FourStemTrackValidator,
    FiveStemTrackValidator,
    SplitStemTrackValidator,
]);

export type Track =
    | SingleTrack
    | TwoStemTrack
    | FourStemTrack
    | FiveStemTrack
    | SplitStemTrack;
