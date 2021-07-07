import { Box, Theme, withStyles } from "@material-ui/core";
import React, { useCallback } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { PlainFn } from "../../common/PlainFn";
import { lyricStyle, lyricTypographyVariant } from "../display/Lyric";
import { ChordSongAction } from "../reducer/reducer";
import { useEditingState } from "./InteractionContext";
import UnstyledLyricInput from "./lyric_input/LyricInput";

const LyricInput = withStyles((theme: Theme) => ({
    root: {
        ...lyricStyle.root,
        borderBottom: "solid",
        borderBottomColor: theme.palette.secondary.main,
        borderBottomWidth: "2px",
    },
}))(UnstyledLyricInput);

interface WithLyricInputProps {
    children: (handleEdit: PlainFn) => React.ReactElement;
    chordLine: ChordLine;
    songDispatch: React.Dispatch<ChordSongAction>;
    onJSONPaste?: (id: IDable<ChordLine>, jsonStr: string) => boolean;
    onMergeWithPreviousLine?: (id: IDable<ChordLine>) => boolean;
}

// this component is inherently quite coupled with Line & friends
// however, this is a good opportunity to separate concerns and organize functionality
const WithLyricInput: React.FC<WithLyricInputProps> = (
    props: WithLyricInputProps
): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();
    const { songDispatch, chordLine } = props;

    const handlers = {
        lyricEdit: useCallback(
            (newLyric: Lyric) => {
                finishEdit();

                songDispatch({
                    type: "replace-line-lyrics",
                    lineID: chordLine,
                    newLyric: newLyric,
                });
            },
            [chordLine, songDispatch, finishEdit]
        ),
        lyricPasteOverflow: useCallback(
            (overflowContent: Lyric[]) => {
                songDispatch({
                    type: "insert-overflow-lyrics",
                    insertionLineID: chordLine,
                    overflowLyrics: overflowContent,
                });
                finishEdit();
            },
            [chordLine, songDispatch, finishEdit]
        ),
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
        specialEnter: useCallback(
            (splitIndex: number) => {
                console.log("special enter");

                songDispatch({
                    type: "split-line",
                    lineID: chordLine,
                    splitIndex: splitIndex,
                });

                finishEdit();
            },
            [chordLine, songDispatch, finishEdit]
        ),
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
                    onLyricOverflow={handlers.lyricPasteOverflow}
                    onSpecialBackspace={handlers.specialBackspace}
                    onSpecialEnter={handlers.specialEnter}
                >
                    {props.chordLine.lyrics}
                </LyricInput>
            </Box>
        </>
    );
};

export default WithLyricInput;
