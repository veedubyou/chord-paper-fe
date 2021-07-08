import {
    Grid,
    makeStyles,
    Paper as UnstyledPaper,
    withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { ChordSongAction } from "../reducer/reducer";
import { useBatchLineDelete } from "./BatchDelete";
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
    songDispatch: React.Dispatch<ChordSongAction>;
    onSongChanged?: (updatedSong: ChordSong) => void;
}

const ChordPaperBody: React.FC<ChordPaperBodyProps> = (
    props: ChordPaperBodyProps
): React.ReactElement => {
    const [interacting, setInteracting] = useState(false);
    const handleCopy = useLineCopyHandler(props.song);
    const handleLinePaste = useLinePasteHandler(props.song);
    const handleBatchLineDelete = useBatchLineDelete(props.song);
    const songDispatch = props.songDispatch;

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

    const handleChangeLine = (id: IDable<ChordLine>) => {
        notifySongChanged();
    };

    const handleJSONPaste = (
        id: IDable<ChordLine>,
        jsonStr: string
    ): boolean => {
        const handled = handleLinePaste(id, jsonStr);
        if (!handled) {
            return false;
        }

        notifySongChanged();
        return true;
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const handled = handleBatchLineDelete(event);
        if (!handled) {
            return false;
        }

        notifySongChanged();
        return true;
    };

    const notifySongChanged = () => {
        props.onSongChanged?.(props.song);
    };

    const handleChordDND = (
        destinationBlockID: IDable<ChordBlock>,
        splitIndex: number,
        newChord: string,
        sourceBlockID: IDable<ChordBlock>,
        copyAction: boolean
    ) => {
        const [sourceLine, sourceBlock] =
            props.song.findLineAndBlock(sourceBlockID);

        const moveAction = !copyAction;
        if (moveAction) {
            // clearing the source block first allows handling of when the chord
            // is dropped onto another token in the same block without special cases
            sourceBlock.chord = "";
        }

        const [destinationLine, destinationBlock] =
            props.song.findLineAndBlock(destinationBlockID);

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
                return [
                    <Line
                        key={line.id}
                        chordLine={line}
                        songDispatch={songDispatch}
                        data-lineid={line.id}
                        onChangeLine={handleChangeLine}
                        onJSONPaste={handleJSONPaste}
                        onChordDragAndDrop={handleChordDND}
                        data-testid={`Line-${index}`}
                    />,
                    <NewLine
                        key={"NewLine-" + line.id}
                        lineID={line}
                        songDispatch={songDispatch}
                        data-testid={`NewLine-${index}`}
                    />,
                ];
            }
        );

        const firstNewLine = (
            <NewLine
                key={"NewLine-Top"}
                lineID="beginning"
                songDispatch={songDispatch}
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
                    onKeyDown={allowInteraction ? handleKeyDown : undefined}
                    onCopy={allowInteraction ? handleCopy : undefined}
                    className={paperClassName}
                    elevation={0}
                    tabIndex={0}
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
