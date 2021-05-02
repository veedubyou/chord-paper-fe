import * as iots from "io-ts";
import { SingleTrack, SingleTrackValidator } from "./SingleTrack";
import {
    FiveStemTrack,
    FiveStemTrackValidator,
    FourStemTrack,
    FourStemTrackValidator,
    TwoStemTrack,
    TwoStemTrackValidator,
} from "./StemTrack";

export const TrackValidator = iots.union([
    SingleTrackValidator,
    TwoStemTrackValidator,
    FourStemTrackValidator,
    FiveStemTrackValidator,
]);

export type Track = SingleTrack | TwoStemTrack | FourStemTrack | FiveStemTrack;
