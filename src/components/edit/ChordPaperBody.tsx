import {
    Grid,
    makeStyles,
    Paper as UnstyledPaper,
    withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { useLineCopyHandler, useLinePasteHandler } from "./CopyAndPaste";
import DragAndDrop from "./DragAndDrop";
import { InteractionContext, InteractionSetter } from "./InteractionContext";
import Line from "./Line";
import NewLine from "./NewLine";

const useUninteractiveStyle = makeStyles({
    root: {
        pointerEvents: "none",
    },
});

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
    const [interacting, setInteracting] = useState(false);
    const handleCopy = useLineCopyHandler(props.song);
    const handleLinePaste = useLinePasteHandler(props.song);

    const interactionContextValue: InteractionSetter = {
        startInteraction: () => {
            setTimeout(() => {
                setInteracting(true);
            });
        },
        endInteraction: () => {
            setTimeout(() => {
                setInteracting(false);
            });
        },
    };

    const uninteractiveStyle = useUninteractiveStyle();

    const handleAddLineToTop = () => {
        const newLine: ChordLine = new ChordLine();
        props.song.addBeginning(newLine);
        notifySongChanged();
    };

    const handleAddLine = (id: IDable<"ChordLine">) => {
        const newLine: ChordLine = new ChordLine();
        props.song.addAfter(id, newLine);
        notifySongChanged();
    };

    const handleRemoveLine = (id: IDable<"ChordLine">) => {
        props.song.remove(id);
        notifySongChanged();
    };

    const handleChangeLine = (id: IDable<"ChordLine">) => {
        notifySongChanged();
    };

    const handlePasteOverflow = (
        id: IDable<"ChordLine">,
        overflowContent: string[]
    ) => {
        const newChordLines = overflowContent.map((newLyricLine: string) =>
            ChordLine.fromLyrics(newLyricLine)
        );
        props.song.addAfter(id, ...newChordLines);
        notifySongChanged();
    };

    const handleJSONPaste = (
        id: IDable<"ChordLine">,
        jsonStr: string
    ): boolean => {
        const handled = handleLinePaste(id, jsonStr);
        if (!handled) {
            return false;
        }

        notifySongChanged();
        return true;
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

    const handleChordDND = (
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
                    handleAddLine(line);
                };

                return [
                    <Line
                        key={line.id}
                        chordLine={line}
                        data-lineid={line.id}
                        onAddLine={handleAddLine}
                        onRemoveLine={handleRemoveLine}
                        onChangeLine={handleChangeLine}
                        onJSONPaste={handleJSONPaste}
                        onPasteOverflow={handlePasteOverflow}
                        onMergeWithPreviousLine={mergeWithPreviousLine}
                        onChordDragAndDrop={handleChordDND}
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
                onAdd={handleAddLineToTop}
                data-testid={"NewLine-Top"}
            />
        );
        lines.splice(0, 0, firstNewLine);

        return lines;
    };

    // prevent other interactions if currently interacting
    const allowInteraction: boolean = !interacting;
    const paperClassName = allowInteraction
        ? undefined
        : uninteractiveStyle.root;

    return (
        <DragAndDrop>
            <InteractionContext.Provider value={interactionContextValue}>
                <Paper
                    onCopy={handleCopy}
                    className={paperClassName}
                    elevation={0}
                >
                    <Grid container justify="center">
                        <Grid item xs={10}>
                            {lines()}
                        </Grid>
                    </Grid>
                </Paper>
            </InteractionContext.Provider>
        </DragAndDrop>
    );
};

export default ChordPaperBody;
