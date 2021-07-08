import { Box, Theme, withStyles } from "@material-ui/core";
import { isLeft } from "fp-ts/lib/Either";
import { useSnackbar } from "notistack";
import React, { useMemo } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { Lyric } from "../../common/ChordModel/Lyric";
import { PlainFn } from "../../common/PlainFn";
import { lyricStyle, lyricTypographyVariant } from "../display/Lyric";
import { ChordSongAction } from "../reducer/reducer";
import { deserializeCopiedChordLines } from "./CopyAndPaste";
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
}

// this component is inherently quite coupled with Line & friends
// however, this is a good opportunity to separate concerns and organize functionality
const WithLyricInput: React.FC<WithLyricInputProps> = (
    props: WithLyricInputProps
): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();
    const { songDispatch, chordLine } = props;
    const { enqueueSnackbar } = useSnackbar();

    const handlers = useMemo(
        () => ({
            lyricEdit: (newLyric: Lyric) => {
                finishEdit();

                songDispatch({
                    type: "replace-line-lyrics",
                    line: chordLine,
                    lineID: chordLine,
                    newLyric: newLyric,
                });
            },

            lyricPasteOverflow: (overflowContent: Lyric[]) => {
                songDispatch({
                    type: "insert-overflow-lyrics",
                    insertionLineID: chordLine,
                    overflowLyrics: overflowContent,
                });
                finishEdit();
            },
            jsonPaste: (jsonStr: string): boolean => {
                const deserializedCopyResult =
                    deserializeCopiedChordLines(jsonStr);
                // not actually a Chord Paper line payload, don't handle it
                if (deserializedCopyResult === null) {
                    return false;
                }

                if (isLeft(deserializedCopyResult)) {
                    const errorMsg =
                        "Failed to paste copied lines: " +
                        deserializedCopyResult.left.message;
                    enqueueSnackbar(errorMsg, { variant: "error" });
                    return true;
                }

                songDispatch({
                    type: "batch-insert-lines",
                    insertLineID: chordLine,
                    copiedLines: deserializedCopyResult.right,
                });

                return true;
            },

            specialBackspace: () => {
                songDispatch({
                    type: "merge-lines",
                    latterLineID: chordLine,
                });
                finishEdit();
            },
            specialEnter: (splitIndex: number) => {
                songDispatch({
                    type: "split-line",
                    lineID: chordLine,
                    splitIndex: splitIndex,
                });

                finishEdit();
            },
        }),
        [chordLine, songDispatch, finishEdit, enqueueSnackbar]
    );

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
