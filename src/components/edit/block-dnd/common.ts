import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";

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

export interface DropParams {
    readonly tokenIndex: number;
    readonly blockID: IDable<ChordBlock>;
}

export interface TypedDropParams extends DropParams {
    type: "dropped-chord-result";
}

export interface DropResult extends TypedDropParams {
    dropEffect: "move" | "copy";
}

export const isDropResult = (
    maybeDropResult: any
): maybeDropResult is DropResult => {
    if (maybeDropResult === null || maybeDropResult === undefined) {
        return false;
    }

    if (typeof maybeDropResult !== "object") {
        return false;
    }

    return maybeDropResult.type === "dropped-chord-result";
};

export interface DropCollector {
    isOver: boolean;
}

export type DragOverHandler = (isDraggingOver: boolean) => void;
