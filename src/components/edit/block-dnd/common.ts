import { ChordBlock } from "common/ChordModel/ChordBlock";
import { IDable } from "common/ChordModel/Collection";

export const DNDChordType: "chord" = "chord";

export interface DNDChord {
    type: typeof DNDChordType;
    sourceBlockID: IDable<ChordBlock>;
    chord: string;
}

export const NewDNDChord = (
    sourceBlockID: IDable<ChordBlock>,
    chord: string
): DNDChord => {
    return {
        type: DNDChordType,
        sourceBlockID: sourceBlockID,
        chord: chord,
    };
};

export interface ClassNameable {
    className?: string;
}

export type DragOverHandler = (isDraggingOver: boolean) => void;
