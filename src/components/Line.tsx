import { Box, Slide } from "@material-ui/core";
import React, { useState } from "react";
import EditableLine from "./EditableLine";

import { DataTestID } from "../common/DataTestID";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { IDable } from "../common/ChordModel/Collection";
import NonEditableLine from "./NonEditableLine";

interface LineProps extends DataTestID {
    chordLine: ChordLine;
    onChangeLine?: (id: IDable<"ChordLine">) => void;
    onAddLine?: (id: IDable<"ChordLine">) => void;
    onRemoveLine?: (id: IDable<"ChordLine">) => void;
    onPasteOverflow?: (
        id: IDable<"ChordLine">,
        overflowPasteContent: string[]
    ) => void;
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [removed, setRemoved] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = (newLyrics: string) => {
        setEditing(false);

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

    const nonEditableLine = (): React.ReactElement => {
        return (
            <NonEditableLine
                chordLine={props.chordLine}
                onChangeLine={props.onChangeLine}
                onAddButton={addHandler}
                onRemoveButton={removeHandler}
                onEditButton={startEdit}
            />
        );
    };

    const editLyricsInput = (): React.ReactElement => {
        const lyrics = props.chordLine.lyrics;

        return (
            <Box position="absolute" left="0" bottom="2px" width="100%">
                <EditableLine
                    variant="h5"
                    onFinish={finishEdit}
                    onPasteOverflow={pasteOverflowHandler}
                >
                    {lyrics}
                </EditableLine>
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
                width="auto"
                minWidth="30em"
                margin="3rem"
                position="relative"
                data-testid={props["data-testid"]}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
