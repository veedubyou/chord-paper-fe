import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { getSelectedLineIDs } from "./LineSelection";

export const handleBatchLineDelete = (
    event: React.KeyboardEvent<HTMLDivElement>
): false | IDable<ChordLine>[] => {
    if (event.key !== "Backspace") {
        return false;
    }

    const lineIDs: string[] = getSelectedLineIDs();
    if (lineIDs.length === 0) {
        return false;
    }

    event.preventDefault();

    return lineIDs.map((id: string) => ({
        type: "ChordLine",
        id: id,
    }));
};
