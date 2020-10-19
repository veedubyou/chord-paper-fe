import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { getSelectedLineIDs } from "./LineSelection";

export const useBatchLineDelete = (song: ChordSong) => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        if (event.key !== "Backspace") {
            return false;
        }

        const lineIDs: string[] = getSelectedLineIDs();
        if (lineIDs.length === 0) {
            return false;
        }

        const lineIDables: IDable<ChordLine>[] = lineIDs.map((id: string) => ({
            type: "ChordLine",
            id: id,
        }));

        song.removeMultiple(lineIDables);
        event.preventDefault();

        return true;
    };
};
