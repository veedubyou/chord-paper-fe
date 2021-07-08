import { useCallback, useReducer } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { Note } from "../../common/music/foundation/Note";
import { transposeSong } from "../../common/music/transpose/Transpose";
import lodash from "lodash";

type SetState = {
    type: "set-song";
    song: ChordSong;
};

type SetHeader = {
    type: "set-header";
    title?: string;
    composedBy?: string;
    performedBy?: string;
};

type Transpose = {
    type: "transpose";
    originalKey: Note;
    transposeKey: Note;
};

type AddLineBeginning = {
    type: "add-line-beginning";
};

type AddLineAfter = {
    type: "add-line-after";
    lineID: IDable<ChordLine>;
};

type RemoveLine = {
    type: "remove-line";
    lineID: IDable<ChordLine>;
};

type SplitLine = {
    type: "split-line";
    lineID: IDable<ChordLine>;
    splitIndex: number;
};

type MergeLines = {
    type: "merge-lines";
    latterLineID: IDable<ChordLine>;
};

type JSONPaste = {
    type: "json-paste";
};

type InsertOverflowLyrics = {
    type: "insert-overflow-lyrics";
    insertionLineID: IDable<ChordLine>;
    overflowLyrics: Lyric[];
};

type ReplaceLineLyrics = {
    type: "replace-line-lyrics";
    lineID: IDable<ChordLine>;
    newLyric: Lyric;
};

export type ChordSongAction =
    | SetState
    | SetHeader
    | AddLineBeginning
    | AddLineAfter
    | RemoveLine
    | SplitLine
    | MergeLines
    | InsertOverflowLyrics
    | ReplaceLineLyrics
    | Transpose;

const chordSongReducer = (
    song: ChordSong,
    action: ChordSongAction
): ChordSong => {
    switch (action.type) {
        case "set-song": {
            return action.song.clone();
        }

        case "set-header": {
            if (action.title !== undefined) {
                song.title = action.title;
            }

            if (action.composedBy !== undefined) {
                song.composedBy = action.composedBy;
            }

            if (action.performedBy !== undefined) {
                song.performedBy = action.performedBy;
            }

            return song.clone();
        }

        case "add-line-beginning": {
            song.addBeginning(new ChordLine());
            return song.clone();
        }

        case "add-line-after": {
            song.addAfter(action.lineID, new ChordLine());
            return song.clone();
        }

        case "remove-line": {
            song.remove(action.lineID);
            return song.clone();
        }

        case "split-line": {
            song.splitLine(action.lineID, action.splitIndex);
            return song.clone();
        }

        case "merge-lines": {
            const merged = song.mergeLineWithPrevious(action.latterLineID);
            if (!merged) {
                return song;
            }

            return song.clone();
        }

        case "replace-line-lyrics": {
            const line = song.get(action.lineID);
            line.replaceLyrics(action.newLyric);
            return song.clone();
        }

        case "insert-overflow-lyrics": {
            const newChordLines: ChordLine[] = action.overflowLyrics.map(
                (newLyricLine: Lyric) => ChordLine.fromLyrics(newLyricLine)
            );
            song.addAfter(action.insertionLineID, ...newChordLines);
            return song.clone();
        }

        case "transpose": {
            transposeSong(song, action.originalKey, action.transposeKey);

            return song.clone();
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
