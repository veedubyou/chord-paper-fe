import * as iots from "io-ts";

export const validateValue = (value: string): boolean => {
    return value.trim() !== "";
};

export const BaseTrackValidator = iots.type({
    id: iots.string,
    label: iots.string,
});
