import { Box, Slide } from "@material-ui/core";
import React, { useState, useContext } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { DataTestID } from "../../common/DataTestID";
import { lyricTypographyVariant } from "../display/Lyric";
import { BlockProps } from "./Block";
import ChordEditLine from "./ChordEditLine";
import TextInput from "./TextInput";
import { InteractionContext } from "./InteractionContext";

interface LineProps extends DataTestID {
    chordLine: ChordLine;
    onChangeLine?: (id: IDable<"ChordLine">) => void;
    onAddLine?: (id: IDable<"ChordLine">) => void;
    onRemoveLine?: (id: IDable<"ChordLine">) => void;
    onPasteOverflow?: (
        id: IDable<"ChordLine">,
        overflowPasteContent: string[]
    ) => void;
    onMergeWithPreviousLine?: (id: IDable<"ChordLine">) => boolean;
    onChordDragAndDrop?: BlockProps["onChordDragAndDrop"];
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [removed, setRemoved] = useState(false);

    const { startInteraction, endInteraction } = useContext(InteractionContext);

    const startEdit = () => {
        setEditing(true);
        startInteraction();
    };

    const finishEdit = (newLyrics: string) => {
        setEditing(false);

        endInteraction();

        props.chordLine.replaceLyrics(newLyrics);

        if (props.onChangeLine) {
            props.onChangeLine(props.chordLine);
        }
    };

    const addHandler = () => {
        if (props.onAddLine) {
            props.onAddLine(props.chordLine);
        }
    };

    const removalTime = 250;

    const removeHandler = () => {
        if (removed) {
            return;
        }

        setRemoved(true);

        if (props.onRemoveLine) {
            setTimeout(() => {
                if (props.onRemoveLine) {
                    props.onRemoveLine(props.chordLine);
                }
            }, removalTime);
        }
    };

    const pasteOverflowHandler = (overflowContent: string[]) => {
        if (props.onPasteOverflow) {
            props.onPasteOverflow(props.chordLine, overflowContent);
            setEditing(false);
        }
    };

    const specialBackspaceHandler = () => {
        if (props.onMergeWithPreviousLine) {
            const handledAndStopEditing = props.onMergeWithPreviousLine(
                props.chordLine
            );
            if (handledAndStopEditing) {
                setEditing(false);
            }
        }
    };

    const nonEditableLine = (): React.ReactElement => {
        return (
            <ChordEditLine
                chordLine={props.chordLine}
                onChangeLine={props.onChangeLine}
                onChordDragAndDrop={props.onChordDragAndDrop}
                onAdd={addHandler}
                onRemove={removeHandler}
                onEdit={startEdit}
            />
        );
    };

    const editLyricsInput = (): React.ReactElement => {
        const lyrics = props.chordLine.lyrics;

        return (
            <Box position="absolute" left="0" bottom="2px" width="100%">
                <TextInput
                    variant={lyricTypographyVariant}
                    onFinish={finishEdit}
                    onPasteOverflow={pasteOverflowHandler}
                    onSpecialBackspace={specialBackspaceHandler}
                >
                    {lyrics}
                </TextInput>
            </Box>
        );
    };

    let elem: React.ReactElement;
    if (editing) {
        // using a css trick to overlay the lyrics edit input over
        // the noneditable lyrics line so chords are still showing
        elem = (
            <>
                {nonEditableLine()}
                {editLyricsInput()}
            </>
        );
    } else {
        elem = nonEditableLine();
    }

    const yeetDirection = removed ? "up" : "down";

    return (
        <Slide direction={yeetDirection} in={!removed} timeout={removalTime}>
            <Box
                borderBottom={1}
                borderColor="grey.50"
                width="100%"
                position="relative"
                data-testid={props["data-testid"]}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
