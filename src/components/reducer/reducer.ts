import { useCallback, useReducer } from "react";
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
    | RemoveLine
    | BatchInsertLines
    | BatchRemoveLines
    | SplitLine
    | MergeLines
    | InsertOverflowLyrics
    | ReplaceLineLyrics
    | DragAndDropChord
    | SetChord
    | SplitBlock
    | SetSection
    | Transpose;

const chordSongReducer = (
    song: ChordSong,
    action: ChordSongAction
): ChordSong => {
    switch (action.type) {
        case "replace-song": {
            return action.newSong;
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

            return song;
        }

        case "set-last-saved-at": {
            return song.set("lastSavedAt", action.lastSavedAt);
        }

        case "add-line": {
            if (action.lineID === "beginning") {
                return song.addBeginning(new ChordLine({}));
            }
            return song.addAfter(action.lineID, new ChordLine({}));
        }

        case "remove-line": {
            return song.removeElement(action.lineID);
        }

        case "split-line": {
            const [newSong, splitted] = song.splitLine(
                action.lineID,
                action.splitIndex
            );
            if (!splitted) {
                return song;
            }

            return newSong;
        }

        case "merge-lines": {
            const [newSong, merged] = song.mergeLineWithPrevious(
                action.latterLineID
            );
            if (!merged) {
                return song;
            }

            return newSong;
        }

        case "batch-insert-lines": {
            const currLine: ChordLine = song.get(action.insertLineID);

            song = song.addAfter(action.insertLineID, ...action.copiedLines);

            // if the line is empty, the user was probably trying to paste into the current line, and not the next
            // so just remove the current line to simulate that
            if (currLine.isEmpty()) {
                song = song.removeElement(action.insertLineID);
            }

            return song;
        }

        case "batch-remove-lines": {
            return song.removeMultipleElements(action.lineIDs);
        }

        case "replace-line-lyrics": {
            return song.replaceElement(action.lineID, (line) => {
                return line.replaceLyrics(action.newLyric);
            });
        }

        case "insert-overflow-lyrics": {
            const newChordLines: ChordLine[] = action.overflowLyrics.map(
                (newLyricLine: Lyric) => ChordLine.fromLyrics(newLyricLine)
            );
            return song.addAfter(action.insertionLineID, ...newChordLines);
        }

        case "set-chord": {
            return song.replaceElement(action.lineID, (line) => {
                return line.setChord(action.blockID, action.newChord);
            });
        }

        case "split-block": {
            return song.replaceElement(action.lineID, (line) => {
                return line.splitBlock(action.blockID, action.splitIndex);
            });
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

            return song;
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

            return song.updateCollection((elements) => {
                return elements.replace(action.lineID, (line) => {
                    line = updateName(line);
                    line = updateTime(line);
                    return line;
                });
            });
        }

        case "transpose": {
            return song.transpose(action.originalKey, action.transposeKey);
        }
    }
};

export const useChordSongReducer = (
    initialSong: ChordSong,
    onChange?: (newSong: ChordSong, action: ChordSongAction) => void
): [ChordSong, React.Dispatch<ChordSongAction>] => {
    const reducerWithChangeCallback = useCallback(
        (song: ChordSong, action: ChordSongAction): ChordSong => {
            const newSong: ChordSong = chordSongReducer(song, action);
            onChange?.(newSong, action);

            return newSong;
        },
        [onChange]
    );

    return useReducer(reducerWithChangeCallback, initialSong);
};
