import { ChordSong } from "../../../common/ChordModel/ChordSong";
export const useSaveMenuAction = (song: ChordSong) => {
    return () => {
        const jsonStr = JSON.stringify(song.fork());

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
