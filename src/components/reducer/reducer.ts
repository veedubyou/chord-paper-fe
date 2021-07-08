import lodash from "lodash";
import { useCallback, useReducer } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { Note } from "../../common/music/foundation/Note";
import { transposeSong } from "../../common/music/transpose/Transpose";

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

type AddLine = {
    type: "add-line";
    lineID: IDable<ChordLine> | "beginning";
};

type RemoveLine = {
    type: "remove-line";
    lineID: IDable<ChordLine>;
};

type BatchInsertLines = {
    type: "batch-insert-lines";
    insertLineID: IDable<ChordLine>;
    copiedLines: ChordLine[];
};

type BatchRemoveLines = {
    type: "batch-remove-lines";
    lineIDs: IDable<ChordLine>[];
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

type InsertOverflowLyrics = {
    type: "insert-overflow-lyrics";
    insertionLineID: IDable<ChordLine>;
    overflowLyrics: Lyric[];
};

type ReplaceLineLyrics = {
    type: "replace-line-lyrics";
    line: ChordLine;
    lineID: IDable<ChordLine>;
    newLyric: Lyric;
};

type ChangeChord = {
    type: "change-chord";
    lineID: IDable<ChordLine>;
    blockID: IDable<ChordBlock>;
    newChord: string;
};

type SplitBlock = {
    type: "split-block";
    lineID: IDable<ChordLine>;
    blockID: IDable<ChordBlock>;
    splitIndex: number;
};

type DragAndDropChord = {
    type: "drag-and-drop-chord";
    sourceBlockID: IDable<ChordBlock>;
    newChord: string;
    destinationBlockID: IDable<ChordBlock>;
    splitIndex: number;
    copyAction: boolean;
};

type SetSection = {
    type: "set-section";
    lineID: IDable<ChordLine>;
    label?: string;
    time?: number | null;
};

export type ChordSongAction =
    | SetState
    | SetHeader
    | AddLine
    | RemoveLine
    | BatchInsertLines
    | BatchRemoveLines
    | SplitLine
    | MergeLines
    | InsertOverflowLyrics
    | ReplaceLineLyrics
    | DragAndDropChord
    | ChangeChord
    | SplitBlock
    | SetSection
    | Transpose;

const chordSongReducer = (
    song: ChordSong,
    action: ChordSongAction
): ChordSong => {
    // TODO: performance killer
    // need to change this into immutable object pattern
    song = lodash.cloneDeep(song);

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

        case "add-line": {
            if (action.lineID === "beginning") {
                song.addBeginning(new ChordLine());
            } else {
                song.addAfter(action.lineID, new ChordLine());
            }

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

        case "batch-insert-lines": {
            const currLine: ChordLine = song.get(action.insertLineID);

            song.addAfter(action.insertLineID, ...action.copiedLines);

            // if the line is empty, the user was probably trying to paste into the current line, and not the next
            // so just remove the current line to simulate that
            if (currLine.isEmpty()) {
                song.remove(action.insertLineID);
            }

            return song.clone();
        }

        case "batch-remove-lines": {
            song.removeMultiple(action.lineIDs);
            return song.clone();
        }

        case "replace-line-lyrics": {
            const line: ChordLine = song.get(action.lineID);

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

        case "change-chord": {
            const line: ChordLine = song.get(action.lineID);
            line.setChord(action.blockID, action.newChord);
            return song.clone();
        }

        case "split-block": {
            const line: ChordLine = song.get(action.lineID);
            line.splitBlock(action.blockID, action.splitIndex);
            return song.clone();
        }

        case "drag-and-drop-chord": {
            const [sourceLine, sourceBlock] = song.findLineAndBlock(
                action.sourceBlockID
            );

            const moveAction = !action.copyAction;
            if (moveAction) {
                // clearing the source block first allows handling of when the chord
                // is dropped onto another token in the same block without special cases
                sourceBlock.chord = "";
            }

            const [destinationLine, destinationBlock] = song.findLineAndBlock(
                action.destinationBlockID
            );

            if (action.splitIndex !== 0) {
                destinationLine.splitBlock(
                    action.destinationBlockID,
                    action.splitIndex
                );
            }

            destinationBlock.chord = action.newChord;

            sourceLine.normalizeBlocks();
            destinationLine.normalizeBlocks();

            return song.clone();
        }

        case "set-section": {
            const line: ChordLine = song.get(action.lineID);

            let changed = false;
            if (action.label !== undefined) {
                changed = line.setSectionName(action.label) || changed;
            }

            if (action.time !== undefined) {
                changed = line.setSectionTime(action.time) || changed;
            }

            if (!changed) {
                return song;
            }

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
