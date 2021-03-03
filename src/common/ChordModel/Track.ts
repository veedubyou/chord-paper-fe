import * as iots from "io-ts";

export const TrackValidator = iots.type({
    label: iots.string,
    url: iots.string,
});

export type Track = iots.TypeOf<typeof TrackValidator>;
