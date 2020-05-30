import {
    Box,
    withStyles,
    Grid,
    ButtonGroup,
    Theme,
    Button as UnstyledButton,
    Tooltip as UnstyledTooltip,
} from "@material-ui/core";
import React from "react";

import grey from "@material-ui/core/colors/grey";

import { DataTestID } from "../common/DataTestID";
import { ChordBlock, ChordLine } from "../common/ChordModels";
import Block from "./Block";

import UnstyledEditIcon from "@material-ui/icons/Edit";
import UnstyledAddIcon from "@material-ui/icons/Add";
import UnstyledRemoveIcon from "@material-ui/icons/Remove";
import { IDable } from "../common/Collection";

const iconColorStyle = {
    root: {
        color: "white",
    },
};

const EditIcon = withStyles(iconColorStyle)(UnstyledEditIcon);
const AddIcon = withStyles(iconColorStyle)(UnstyledAddIcon);
const RemoveIcon = withStyles(iconColorStyle)(UnstyledRemoveIcon);

const Button = withStyles((theme: Theme) => ({
    contained: {
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))(UnstyledButton);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
    },
})(UnstyledTooltip);

const HighlightableBox = withStyles({
    root: {
        "&:hover": {
            backgroundColor: grey[100],
        },
    },
})(Box);

interface NonEditableLineProps extends DataTestID {
    chordLine: ChordLine;
    onEditButton?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    onAddButton?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    onRemoveButton?: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    onChangeLine?: (id: IDable<"ChordLine">) => void;
}

const NonEditableLine: React.FC<NonEditableLineProps> = (
    props: NonEditableLineProps
): JSX.Element => {
    let chordBlocks: ChordBlock[] = props.chordLine.chordBlocks;
    if (chordBlocks.length === 0) {
        chordBlocks = [
            new ChordBlock({
                chord: "",
                lyric: "",
            }),
        ];
    }

    const hoverMenu = (): React.ReactElement => {
        return (
            <ButtonGroup variant="outlined">
                <Button
                    variant="contained"
                    onClick={props.onEditButton}
                    data-testid={"EditButton"}
                >
                    <EditIcon />
                </Button>
                <Button
                    variant="contained"
                    onClick={props.onAddButton}
                    data-testid={"AddButton"}
                >
                    <AddIcon />
                </Button>
                <Button
                    variant="contained"
                    onClick={props.onRemoveButton}
                    data-testid={"RemoveButton"}
                >
                    <RemoveIcon />
                </Button>
            </ButtonGroup>
        );
    };

    const chordChangeHandler = (id: IDable<"ChordBlock">, newChord: string) => {
        props.chordLine.setChord(id, newChord);

        if (props.onChangeLine) {
            props.onChangeLine(props.chordLine);
        }
    };

    const blocks: React.ReactElement[] = chordBlocks.map(
        (chordBlock: ChordBlock, index: number) => (
            <Grid item key={index}>
                <Block
                    chordBlock={chordBlock}
                    onChordChange={chordChangeHandler}
                    data-testid={`Block-${index}`}
                ></Block>
            </Grid>
        )
    );

    return (
        <Tooltip title={hoverMenu()} interactive>
            <HighlightableBox data-testid={props["data-testid"]}>
                <Grid container>{blocks}</Grid>
            </HighlightableBox>
        </Tooltip>
    );
};

export default NonEditableLine;
