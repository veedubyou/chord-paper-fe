import React from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { ChordSongAction, removeLines } from "../reducer/reducer";
import { getSelectedLineIDs } from "./LineSelection";

export const handleBatchLineDelete = (
    event: React.KeyboardEvent<HTMLDivElement>,
    songDispatch: React.Dispatch<ChordSongAction>
): boolean => {
    if (event.key !== "Backspace") {
        return false;
    }

    const lineIDStrs: string[] = getSelectedLineIDs();
    if (lineIDStrs.length === 0) {
        return false;
    }

    const lineIDs: IDable<ChordLine>[] = lineIDStrs.map(
        (id: string): IDable<ChordLine> => ({
            type: "ChordLine",
            id: id,
        })
    );

    removeLines(songDispatch, lineIDs);

    return true;
};
