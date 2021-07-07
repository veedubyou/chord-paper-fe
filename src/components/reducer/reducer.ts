import { useCallback, useReducer } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";

export type SetState = {
    type: "set-state";
    song: ChordSong;
};

export type ChordSongAction = SetState;

const chordSongReducer = (
    song: ChordSong,
    action: ChordSongAction
): ChordSong => {
    switch (action.type) {
        case "set-state": {
            return action.song.clone();
        }
    }
};

export const useChordSongReducer = (
    initialSong: ChordSong,
    onChange?: (song: ChordSong) => void
): [ChordSong, React.Dispatch<ChordSongAction>] => {
    const reducerWithChangeCallback = useCallback(
        (song: ChordSong, action: ChordSongAction): ChordSong => {
            const newSong: ChordSong = chordSongReducer(song, action);
            onChange?.(newSong);
            return newSong;
        },
        [onChange]
    );

    return useReducer(reducerWithChangeCallback, initialSong);
};
