import { isLeft } from "fp-ts/lib/Either";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
export const useSaveMenuAction = (song: ChordSong) => {
    return () => {
        const cloneJsonStr = JSON.stringify(song);

        const songClone = ChordSong.deserialize(cloneJsonStr);
        if (isLeft(songClone)) {
            console.error("JSON str was not a proper chord song");
            return;
        }

        songClone.right.id = "";
        songClone.right.owner = "";
        songClone.right.lastSavedAt = null;

        const jsonStr = JSON.stringify(songClone.right);

        const blob = new Blob([jsonStr], {
            type: "application/json",
        });
        const objectURL = URL.createObjectURL(blob);

        const anchor = document.createElement("a");

        anchor.download = "chord_paper_song.json";
        if (song.title !== "") {
            anchor.download = song.title + ".json";
        }
        anchor.href = objectURL;
        anchor.click();

        URL.revokeObjectURL(objectURL);
    };
};
