import { ChordSong } from "./ChordModel/ChordSong";
import { Either, right } from "fp-ts/lib/Either";

const lastSavedKey = "last-auto-saved-song";

export const saveSong = (song: ChordSong) => {
    const localStorage = window.localStorage;
    const jsonStr = JSON.stringify(song);

    localStorage.setItem(lastSavedKey, jsonStr);
};

export const loadSong = (): Either<Error, ChordSong | null> => {
    const localStorage = window.localStorage;

    const jsonSong = localStorage.getItem(lastSavedKey);
    if (jsonSong === null) {
        return right(null);
    }

    return ChordSong.deserialize(jsonSong);
};
