import * as iots from "io-ts";
import { SingleTrack, SingleTrackValidator } from "./SingleTrack";
import { FourStemsTrack, FourStemsTrackValidator } from "./StemTrack";

export const TrackValidator = iots.union([
    SingleTrackValidator,
    FourStemsTrackValidator,
]);

export type Track = SingleTrack | FourStemsTrack;
