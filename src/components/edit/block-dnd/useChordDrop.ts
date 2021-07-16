import { ConnectDropTarget, DropTargetMonitor, useDrop } from "react-dnd";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import { DNDChord, DNDChordType } from "./common";

interface DropObject {
    type: "dropped-chord-result";
    readonly tokenIndex: number;
    readonly blockID: IDable<ChordBlock>;
}

export interface DropResult extends DropObject {
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

interface DropCollector {
    isOver: boolean;
}

export const useChordDrop = (
    blockID: IDable<ChordBlock>,
    tokenIndex: number
): [ConnectDropTarget, boolean] => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DropObject, DropCollector>({
        accept: DNDChordType,
        drop: (): DropObject => {
            return {
                type: "dropped-chord-result",
                blockID: blockID,
                tokenIndex: tokenIndex,
            };
        },
        collect: (monitor: DropTargetMonitor): DropCollector => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    return [dropRef, isOver];
};
