import * as iots from "io-ts";
import { SingleTrack, SingleTrackValidator } from "./SingleTrack";
import {
    FourStemTrack,
    FourStemTrackValidator,
    TwoStemTrack,
    TwoStemTrackValidator,
} from "./StemTrack";

export const TrackValidator = iots.union([
    SingleTrackValidator,
    TwoStemTrackValidator,
    FourStemTrackValidator,
]);

export type Track = SingleTrack | TwoStemTrack | FourStemTrack;
