import { Box, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { PlainFn } from "../../common/PlainFn";
import { lyricStyle, lyricTypographyVariant } from "../display/Lyric";
import { useEditingState } from "./InteractionContext";
import TextInput from "./TextInput";

const LyricInput = withStyles((theme: Theme) => ({
    root: {
        ...lyricStyle.root,
        borderBottom: "solid",
        borderBottomColor: theme.palette.secondary.main,
        borderBottomWidth: "2px",
    },
}))(TextInput);

interface WithLyricInputProps {
    children: (handleEdit: PlainFn) => React.ReactElement;
    chordLine: ChordLine;
    onChangeLine?: (id: IDable<ChordLine>) => void;
    onLyricOverflow?: (id: IDable<ChordLine>, overflowLyric: string[]) => void;
    onJSONPaste?: (id: IDable<ChordLine>, jsonStr: string) => boolean;
    onMergeWithPreviousLine?: (id: IDable<ChordLine>) => boolean;
}

// this component is inherently quite coupled with Line & friends
// however, this is a good opportunity to separate concerns and organize functionality
const WithLyricInput: React.FC<WithLyricInputProps> = (
    props: WithLyricInputProps
): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();

    const handlers = {
        lyricEdit: (newLyrics: string) => {
            finishEdit();

            props.chordLine.replaceLyrics(newLyrics);
            props.onChangeLine?.(props.chordLine);
        },
        pasteOverflow: (overflowContent: string[]) => {
            if (props.onLyricOverflow) {
                props.onLyricOverflow(props.chordLine, overflowContent);
                finishEdit();
            }
        },
        jsonPaste: (jsonStr: string): boolean => {
            if (props.onJSONPaste === undefined) {
                return false;
            }

            return props.onJSONPaste(props.chordLine, jsonStr);
        },
        specialBackspace: () => {
            if (props.onMergeWithPreviousLine) {
                const handledAndStopEditing = props.onMergeWithPreviousLine(
                    props.chordLine
                );
                if (handledAndStopEditing) {
                    finishEdit();
                }
            }
        },
    };

    const lineElement: React.ReactElement = props.children(startEdit);

    if (!editing) {
        return lineElement;
    }

    // using a css trick to overlay the lyrics edit input over
    // the noneditable lyrics line so chords are still showing
    return (
        <>
            {lineElement}
            <Box position="absolute" left="0" bottom="2px" width="100%">
                <LyricInput
                    variant={lyricTypographyVariant}
                    onFinish={handlers.lyricEdit}
                    onJSONPaste={handlers.jsonPaste}
                    onTextOverflow={handlers.pasteOverflow}
                    onSpecialBackspace={handlers.specialBackspace}
                >
                    {props.chordLine.lyrics}
                </LyricInput>
            </Box>
        </>
    );
};

export default WithLyricInput;
