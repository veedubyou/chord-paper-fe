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
import red from "@material-ui/core/colors/red";

import Block from "./Block";

import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import UnstyledEditIcon from "@material-ui/icons/Edit";
import UnstyledAddIcon from "@material-ui/icons/Add";
import UnstyledRemoveIcon from "@material-ui/icons/Remove";
import { IDable } from "../common/ChordModel/Collection";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { ChordLine } from "../common/ChordModel/ChordLine";

const iconColorStyle = {
    root: {
        color: red[300],
    },
};

const BackspaceIcon = withStyles(iconColorStyle)(UnstyledBackspaceIcon);
const EditIcon = withStyles(iconColorStyle)(UnstyledEditIcon);
const AddIcon = withStyles(iconColorStyle)(UnstyledAddIcon);
const RemoveIcon = withStyles(iconColorStyle)(UnstyledRemoveIcon);

const Button = withStyles((theme: Theme) => ({
    contained: {
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))(UnstyledButton);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
        background: "transparent",
    },
})(UnstyledTooltip);

const HighlightableBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            backgroundColor: grey[100],
        },
        // maxWidth: theme.spacing(92),
    },
}))(Box);

interface NonEditableLineProps {
    chordLine: ChordLine;
    onEdit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onAdd?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onRemove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
            <Button onClick={props.onRemove} data-testid={"RemoveButton"}>
                <BackspaceIcon />
            </Button>
        );
    };

    const chordChangeHandler = (id: IDable<"ChordBlock">, newChord: string) => {
        props.chordLine.setChord(id, newChord);

        if (props.onChangeLine) {
            props.onChangeLine(props.chordLine);
        }
    };

    const blockSplitHandler = (
        id: IDable<"ChordBlock">,
        splitIndex: number
    ) => {
        props.chordLine.splitBlock(id, splitIndex);

        if (props.onChangeLine) {
            props.onChangeLine(props.chordLine);
        }
    };

    const blocks: React.ReactElement[] = chordBlocks.map(
        (chordBlock: ChordBlock, index: number) => (
            <Block
                key={chordBlock.id}
                chordBlock={chordBlock}
                onChordChange={chordChangeHandler}
                onBlockSplit={blockSplitHandler}
                data-testid={`Block-${index}`}
            ></Block>
        )
    );

    return (
        <Tooltip placement="right" title={hoverMenu()} interactive>
            <HighlightableBox
                data-testid={"NoneditableLine"}
                onClick={props.onEdit}
            >
                {blocks}
            </HighlightableBox>
        </Tooltip>
    );
};

export default NonEditableLine;
