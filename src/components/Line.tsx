import { Box, Typography, Slide, Grid } from "@material-ui/core";
import React, { useState } from "react";
import EditableLine from "./EditableLine";

import { DataTestID } from "../common/DataTestID";
import { ChordLine } from "../common/ChordModels";
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

    const nonEditableLine = (): React.ReactElement => {
        return (
            <NonEditableLine
                chordLine={props.chordLine}
                onChangeLine={props.onChangeLine}
                onAddButton={addHandler}
                onRemoveButton={removeHandler}
                onEditButton={startEdit}
                data-testid={"NoneditableLine"}
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
                        onFinish={finishEdit}
                        data-testid={"EditableLine"}
                    >
                        {lyrics}
                    </EditableLine>
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
                data-testid={props["data-testid"]}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
