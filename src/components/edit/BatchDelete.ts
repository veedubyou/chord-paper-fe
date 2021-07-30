import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { ChordSongAction } from "../reducer/reducer";
import { getSelectedLineIDs } from "./LineSelection";

export const handleBatchLineDelete = (
    event: KeyboardEvent,
    songDispatch: React.Dispatch<ChordSongAction>
): boolean => {
    if (event.key !== "Backspace") {
        return false;
    }

    const lineIDStrs: string[] = getSelectedLineIDs();
    if (lineIDStrs.length === 0) {
        return false;
    }

    const lineIDs = lineIDStrs.map(
        (id: string): IDable<ChordLine> => ({
            type: "ChordLine",
            id: id,
        })
    );

    songDispatch({
        type: "batch-remove-lines",
        lineIDs: lineIDs,
    });

    return true;
};
