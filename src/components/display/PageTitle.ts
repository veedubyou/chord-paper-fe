import { ChordSong } from "../../common/ChordModel/ChordSong";

export const pageTitle = (song: ChordSong): string => {
    if (song.metadata.title === "") {
        return "Chord Paper";
    }

    return `${song.metadata.title} - Chord Paper`;
};
