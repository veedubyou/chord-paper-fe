import {
    Box,
    Button as UnstyledButton,
    Theme,
    Tooltip as UnstyledTooltip,
    withStyles,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import Block, { BlockProps } from "./Block";

const iconColorStyle = {
    root: {
        color: red[300],
    },
};

const BackspaceIcon = withStyles(iconColorStyle)(UnstyledBackspaceIcon);

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
        margin: 0,
    },
})(UnstyledTooltip);

const HighlightableBox = withStyles({
    root: {
        "&:hover": {
            backgroundColor: grey[100],
        },
    },
})(Box);

interface ChordEditLineProps {
    chordLine: ChordLine;
    onEdit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onAdd?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onRemove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onChangeLine?: (id: IDable<ChordLine>) => void;
    onChordDragAndDrop?: BlockProps["onChordDragAndDrop"];
}

const ChordEditLine: React.FC<ChordEditLineProps> = (
    props: ChordEditLineProps
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

    const chordChangeHandler = (id: IDable<ChordBlock>, newChord: string) => {
        props.chordLine.setChord(id, newChord);

        if (props.onChangeLine) {
            props.onChangeLine(props.chordLine);
        }
    };

    const blockSplitHandler = (id: IDable<ChordBlock>, splitIndex: number) => {
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
                onChordDragAndDrop={props.onChordDragAndDrop}
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

export default ChordEditLine;
