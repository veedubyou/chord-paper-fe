import React from "react";
import { Paper as UnstyledPaper, withStyles, Grid } from "@material-ui/core";
import Line from "./Line";
import { IDable } from "../../common/ChordModel/Collection";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import NewLine from "./NewLine";
import DragAndDrop from "./DragAndDrop";

const Paper = withStyles({
    root: {
        width: "auto",
    },
})(UnstyledPaper);

interface ChordPaperBodyProps {
    song: ChordSong;
    onSongChanged?: (updatedSong: ChordSong) => void;
}

const ChordPaperBody: React.FC<ChordPaperBodyProps> = (
    props: ChordPaperBodyProps
): React.ReactElement => {
    const addLineToTop = () => {
        const newLine: ChordLine = new ChordLine();
        props.song.addBeginning(newLine);
        notifySongChanged();
    };

    const addLine = (id: IDable<"ChordLine">) => {
        const newLine: ChordLine = new ChordLine();
        props.song.addAfter(id, newLine);
        notifySongChanged();
    };

    const removeLine = (id: IDable<"ChordLine">) => {
        props.song.remove(id);
        notifySongChanged();
    };

    const changeLine = (id: IDable<"ChordLine">) => {
        notifySongChanged();
    };

    const pasteOverflowFromLine = (
        id: IDable<"ChordLine">,
        overflowContent: string[]
    ) => {
        const newChordLines = overflowContent.map((newLyricLine: string) =>
            ChordLine.fromLyrics(newLyricLine)
        );
        props.song.addAfter(id, ...newChordLines);
        notifySongChanged();
    };

    const mergeWithPreviousLine = (id: IDable<"ChordLine">): boolean => {
        const didMerge = props.song.mergeLineWithPrevious(id);

        if (didMerge) {
            notifySongChanged();
            return true;
        }

        return false;
    };

    const notifySongChanged = () => {
        if (props.onSongChanged) {
            props.onSongChanged(props.song);
        }
    };

    const chordDragAndDropHandler = (
        destinationBlockID: IDable<"ChordBlock">,
        splitIndex: number,
        newChord: string,
        sourceBlockID: IDable<"ChordBlock">
    ) => {
        // clearing the source block first allows handling of when the chord
        // is dropped onto another token in the same block without special cases
        const [sourceLine, sourceBlock] = props.song.findLineAndBlock(
            sourceBlockID
        );
        sourceBlock.chord = "";

        const [destinationLine, destinationBlock] = props.song.findLineAndBlock(
            destinationBlockID
        );
        if (splitIndex !== 0) {
            destinationLine.splitBlock(destinationBlockID, splitIndex);
        }

        destinationBlock.chord = newChord;

        sourceLine.normalizeBlocks();
        destinationLine.normalizeBlocks();

        notifySongChanged();
    };

    const lines = () => {
        const lines = props.song.chordLines.flatMap(
            (line: ChordLine, index: number) => {
                const addLineBelow = () => {
                    addLine(line);
                };

                return [
                    <Line
                        key={line.id}
                        chordLine={line}
                        onAddLine={addLine}
                        onRemoveLine={removeLine}
                        onChangeLine={changeLine}
                        onPasteOverflow={pasteOverflowFromLine}
                        onMergeWithPreviousLine={mergeWithPreviousLine}
                        onChordDragAndDrop={chordDragAndDropHandler}
                        data-testid={`Line-${index}`}
                    />,
                    <NewLine
                        key={"NewLine-" + line.id}
                        onAdd={addLineBelow}
                        data-testid={`NewLine-${index}`}
                    />,
                ];
            }
        );

        const firstNewLine = (
            <NewLine
                key={"NewLine-Top"}
                onAdd={addLineToTop}
                data-testid={"NewLine-Top"}
            />
        );
        lines.splice(0, 0, firstNewLine);

        return lines;
    };

    return (
        <DragAndDrop>
            <Paper elevation={0}>
                <Grid container>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={10}>
                        {lines()}
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </Paper>
        </DragAndDrop>
    );
};

export default ChordPaperBody;
