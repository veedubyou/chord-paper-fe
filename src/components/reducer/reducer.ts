import { Map, Record } from "immutable";
import React, { useCallback, useReducer } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { Note } from "../../common/music/foundation/Note";

type ReplaceSong = {
    type: "replace-song";
    newSong: ChordSong;
};

type SetHeader = {
    type: "set-header";
    title?: string;
    composedBy?: string;
    performedBy?: string;
};

type SetLastSavedAt = {
    type: "set-last-saved-at";
    lastSavedAt: Date | null;
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

type BatchInsertLines = {
    type: "batch-insert-lines";
    insertLineID: IDable<ChordLine>;
    copiedLines: ChordLine[];
};

type StartRemoveLines = {
    type: "start-remove-lines";
    lineIDs: IDable<ChordLine>[];
    dontUseThisDirectly: "ok-i-wont";
};

type RemoveLines = {
    type: "remove-lines";
    lineIDs: IDable<ChordLine>[];
    dontUseThisDirectly: "ok-i-wont";
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

type SetChord = {
    type: "set-chord";
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
    dropType: "move" | "copy";
};

type SetSection = {
    type: "set-section";
    lineID: IDable<ChordLine>;
    label?: string;
    time?: number | null;
};

export type ChordSongAction =
    | ReplaceSong
    | SetHeader
    | SetLastSavedAt
    | AddLine
    | StartRemoveLines
    | RemoveLines
    | BatchInsertLines
    | SplitLine
    | MergeLines
    | InsertOverflowLyrics
    | ReplaceLineLyrics
    | DragAndDropChord
    | SetChord
    | SplitBlock
    | SetSection
    | Transpose;

export const lineRemovalTime = 250;
export type RemovingLines = Map<string, boolean>;

export const removeLines = (
    songDispatch: React.Dispatch<ChordSongAction>,
    lineIDs: IDable<ChordLine>[]
) => {
    songDispatch({
        type: "start-remove-lines",
        lineIDs: lineIDs,
        dontUseThisDirectly: "ok-i-wont",
    });

    setTimeout(() => {
        songDispatch({
            type: "remove-lines",
            lineIDs: lineIDs,
            dontUseThisDirectly: "ok-i-wont",
        });
    }, lineRemovalTime);
};

type ChordPaperStateType = {
    song: ChordSong;
    removingLines: RemovingLines;
};

const ChordPaperStateConstructor = Record<ChordPaperStateType>({
    song: new ChordSong({}),
    removingLines: Map<string, boolean>(),
});

export type ChordPaperState = ReturnType<typeof ChordPaperStateConstructor>;

const chordSongReducer = (
    state: ChordPaperState,
    action: ChordSongAction
): ChordPaperState => {
    const withNewSong = (song: ChordSong): ChordPaperState => {
        return state.set("song", song);
    };

    let song: ChordSong = state.song;

    switch (action.type) {
        case "replace-song": {
            return withNewSong(action.newSong);
        }

        case "set-header": {
            if (action.title !== undefined) {
                const title: string = action.title;
                song = song.update("metadata", (metadata) => ({
                    ...metadata,
                    title: title,
                }));
            }

            if (action.composedBy !== undefined) {
                const composedBy: string = action.composedBy;
                song = song.update("metadata", (metadata) => ({
                    ...metadata,
                    composedBy: composedBy,
                }));
            }

            if (action.performedBy !== undefined) {
                const performedBy: string = action.performedBy;
                song = song.update("metadata", (metadata) => ({
                    ...metadata,
                    performedBy: performedBy,
                }));
            }

            return withNewSong(song);
        }

        case "set-last-saved-at": {
            song = song.set("lastSavedAt", action.lastSavedAt);
            return withNewSong(song);
        }

        case "add-line": {
            if (action.lineID === "beginning") {
                song = song.addBeginning(new ChordLine({}));
            } else {
                song = song.addAfter(action.lineID, new ChordLine({}));
            }

            return withNewSong(song);
        }

        case "start-remove-lines": {
            state = state.update("removingLines", (removingLines) => {
                for (const lineID of action.lineIDs) {
                    removingLines = removingLines.set(lineID.id, true);
                }

                return removingLines;
            });

            return state;
        }

        case "remove-lines": {
            state = state.update("removingLines", (removingLines) => {
                const lineIDStrs: string[] = action.lineIDs.map(
                    (lineID) => lineID.id
                );
                return removingLines.deleteAll(lineIDStrs);
            });

            song = song.removeMultipleElements(action.lineIDs);

            return withNewSong(song);
        }

        case "split-line": {
            const [newSong, splitted] = song.splitLine(
                action.lineID,
                action.splitIndex
            );

            if (!splitted) {
                return withNewSong(song);
            }

            return withNewSong(newSong);
        }

        case "merge-lines": {
            const [newSong, merged] = song.mergeLineWithPrevious(
                action.latterLineID
            );

            if (!merged) {
                return withNewSong(song);
            }

            return withNewSong(newSong);
        }

        case "batch-insert-lines": {
            const currLine: ChordLine = song.get(action.insertLineID);

            song = song.addAfter(action.insertLineID, ...action.copiedLines);

            // if the line is empty, the user was probably trying to paste into the current line, and not the next
            // so just remove the current line to simulate that
            if (currLine.isEmpty()) {
                song = song.removeElement(action.insertLineID);
            }

            return withNewSong(song);
        }

        case "replace-line-lyrics": {
            song = song.replaceElement(action.lineID, (line) => {
                return line.replaceLyrics(action.newLyric);
            });

            return withNewSong(song);
        }

        case "insert-overflow-lyrics": {
            const newChordLines: ChordLine[] = action.overflowLyrics.map(
                (newLyricLine: Lyric) => ChordLine.fromLyrics(newLyricLine)
            );
            song = song.addAfter(action.insertionLineID, ...newChordLines);

            return withNewSong(song);
        }

        case "set-chord": {
            song = song.replaceElement(action.lineID, (line) => {
                return line.setChord(action.blockID, action.newChord);
            });

            return withNewSong(song);
        }

        case "split-block": {
            song = song.replaceElement(action.lineID, (line) => {
                return line.splitBlock(action.blockID, action.splitIndex);
            });

            return withNewSong(song);
        }

        case "drag-and-drop-chord": {
            let sourceLine = song.findLineWithBlock(action.sourceBlockID);

            let destinationLine = song.findLineWithBlock(
                action.destinationBlockID
            );

            const sameLine = sourceLine === destinationLine;
            const syncSameLines = (newLine: ChordLine) => {
                if (sameLine) {
                    sourceLine = newLine;
                    destinationLine = newLine;
                }
            };

            if (action.dropType === "move") {
                // clearing the source block first allows handling of when the chord
                // is dropped onto another token in the same block without special cases
                sourceLine = sourceLine.replaceElement(
                    action.sourceBlockID,
                    (block) => block.set("chord", "")
                );

                syncSameLines(sourceLine);
            }

            if (action.splitIndex !== 0) {
                destinationLine = destinationLine.splitBlock(
                    action.destinationBlockID,
                    action.splitIndex
                );

                syncSameLines(destinationLine);
            }

            destinationLine = destinationLine.replaceElement(
                action.destinationBlockID,
                (block) => {
                    return block.set("chord", action.newChord);
                }
            );

            syncSameLines(destinationLine);

            if (sameLine) {
                sourceLine = sourceLine.normalizeBlocks();
                syncSameLines(sourceLine);
            } else {
                sourceLine = sourceLine.normalizeBlocks();
                destinationLine = destinationLine.normalizeBlocks();
            }

            song = song.replaceElement(sourceLine, () => sourceLine);
            song = song.replaceElement(destinationLine, () => destinationLine);

            return withNewSong(song);
        }

        case "set-section": {
            const updateName = (line: ChordLine): ChordLine => {
                if (action.label !== undefined) {
                    [line] = line.setSectionName(action.label);
                }

                return line;
            };

            const updateTime = (line: ChordLine): ChordLine => {
                if (action.time !== undefined) {
                    [line] = line.setSectionTime(action.time);
                }

                return line;
            };

            song = song.updateCollection((elements) => {
                return elements.replace(action.lineID, (line) => {
                    line = updateName(line);
                    line = updateTime(line);
                    return line;
                });
            });

            return withNewSong(song);
        }

        case "transpose": {
            song = song.transpose(action.originalKey, action.transposeKey);
            return withNewSong(song);
        }
    }
};

export const useChordSongReducer = (
    initialSong: ChordSong,
    onChange?: (newSong: ChordSong, action: ChordSongAction) => void
): [ChordPaperState, React.Dispatch<ChordSongAction>] => {
    const reducerWithChangeCallback = useCallback(
        (state: ChordPaperState, action: ChordSongAction): ChordPaperState => {
            const newState: ChordPaperState = chordSongReducer(state, action);
            onChange?.(newState.song, action);

            return newState;
        },
        [onChange]
    );

    const initialState = ChordPaperStateConstructor({
        song: initialSong,
        removingLines: Map<string, boolean>(),
    });

    return useReducer(reducerWithChangeCallback, initialState);
};
