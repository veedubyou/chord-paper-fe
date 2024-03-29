import { Box, styled } from "@mui/material";
import { ChordLine } from "common/ChordModel/ChordLine";
import { Lyric } from "common/ChordModel/Lyric";
import { PlainFn } from "common/PlainFn";
import { lyricStyle, lyricTypographyVariant } from "components/display/Lyric";
import { deserializeCopiedChordLines } from "components/edit/CopyAndPaste";
import { useEditingState } from "components/edit/InteractionContext";
import UnstyledLyricInput, { LyricInputProps } from "components/edit/lyric_input/LyricInput";
import { ChordSongAction } from "components/reducer/reducer";
import { isLeft } from "fp-ts/lib/Either";
import { useSnackbar } from "notistack";
import React, { useMemo } from "react";

const LyricInput = styled(UnstyledLyricInput)<LyricInputProps>(({ theme }) => ({
    ...lyricStyle,
    borderBottom: "solid",
    borderBottomColor: theme.palette.secondary.main,
    borderBottomWidth: "2px",
}));

interface LineWithLyricInputProps {
    children: (handleEdit: PlainFn) => React.ReactElement;
    chordLine: ChordLine;
    songDispatch: React.Dispatch<ChordSongAction>;
}

// this component is inherently quite coupled with Line & friends
// however, this is a good opportunity to separate concerns and organize functionality
const LineWithLyricInput: React.FC<LineWithLyricInputProps> = (
    props: LineWithLyricInputProps
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
            jsonPaste: (jsonStr: string): [boolean, PlainFn | null] => {
                const deserializedCopyResult =
                    deserializeCopiedChordLines(jsonStr);
                // not actually a Chord Paper line payload, don't handle it
                if (deserializedCopyResult === null) {
                    return [false, null];
                }

                if (isLeft(deserializedCopyResult)) {
                    const errorMsg =
                        "Failed to paste copied lines: " +
                        deserializedCopyResult.left.message;
                    enqueueSnackbar(errorMsg, { variant: "error" });
                    return [true, null];
                }

                const insertLines = () =>
                    songDispatch({
                        type: "batch-insert-lines",
                        insertLineID: chordLine,
                        copiedLines: deserializedCopyResult.right,
                    });

                return [true, insertLines];
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
            <Box position="absolute" left="0" bottom="0px" width="100%">
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

export default LineWithLyricInput;
