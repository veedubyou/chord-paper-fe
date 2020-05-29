import { Box, Typography, Slide, Grid } from "@material-ui/core";
import React, { useState } from "react";
import EditableLine from "./EditableLine";

import { DataTestID, generateTestID } from "../common/DataTestID";
import { ChordBlock, ChordLine } from "../common/ChordLyric";
import { IDable } from "../common/Collection";
import NonEditableLine from "./NonEditableLine";

interface LineProps extends DataTestID {
    chordLine: ChordLine;
    onChangeLine?: (id: IDable<"ChordLine">) => void;
    onAddLine?: (id: IDable<"ChordLine">) => void;
    onRemoveLine?: (id: IDable<"ChordLine">) => void;
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [removed, setRemoved] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = (newLyrics: string) => {
        setEditing(false);

        const oldLyrics = props.chordLine.lyrics;

        if (newLyrics !== oldLyrics) {
            props.chordLine.clear();

            const newChordBlock: ChordBlock = new ChordBlock({
                // TODO: feature next. chords are currently destructively wiped
                // because anchoring information is lost between edits
                chord: "",
                lyric: newLyrics,
            });
            props.chordLine.push(newChordBlock);
        }

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

    const testID = (suffix: string): string => {
        return generateTestID(props, suffix);
    };

    const nonEditableLine = (): React.ReactElement => {
        return (
            <NonEditableLine
                chordLine={props.chordLine}
                onAddButton={addHandler}
                onRemoveButton={removeHandler}
                onEditButton={startEdit}
                data-testid={testID("NoneditableLine")}
            />
        );
    };

    const editableLine = (): React.ReactElement => {
        const lyrics = props.chordLine.lyrics;

        return (
            <Grid container direction="column">
                <Grid item>
                    <Typography variant="h5">Chords Placeholder</Typography>
                </Grid>
                <Grid item>
                    <EditableLine
                        text={lyrics}
                        onFinish={finishEdit}
                        data-testid={testID("EditableLine")}
                    />
                </Grid>
            </Grid>
        );
    };

    let elem: React.ReactElement = editing ? editableLine() : nonEditableLine();
    const yeetDirection = removed ? "up" : "down";

    return (
        <Slide direction={yeetDirection} in={!removed} timeout={removalTime}>
            <Box
                borderBottom={1}
                borderColor="grey.50"
                width="auto"
                margin={"3rem"}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
