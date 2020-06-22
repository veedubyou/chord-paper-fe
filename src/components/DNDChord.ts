import { IDable } from "../common/ChordModel/Collection";

export const DNDChordType: "chord" = "chord";

export interface DNDChord {
    type: typeof DNDChordType;
    sourceBlockID: IDable<"ChordBlock">;
    chord: string;
    handled: boolean;
}

export const NewDNDChord = (
    sourceBlockID: IDable<"ChordBlock">,
    chord: string
): DNDChord => {
    return {
        type: DNDChordType,
        sourceBlockID: sourceBlockID,
        chord: chord,
        handled: false,
    };
};
