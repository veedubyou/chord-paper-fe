import { Box, Grid, makeStyles, Theme } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { DataTestID } from "../../common/DataTestID";
import { inflatingWhitespace } from "../../common/Whitespace";
import { lyricTypographyVariant } from "../display/Lyric";
import ChordDroppable from "./ChordDroppable";
import DraggableChordSymbol from "./DraggableChordSymbol";
import {
    chordTargetClassName,
    dragOverChordLyricStyle,
    firstTokenClassName,
    hoverChordLyricStyle,
} from "./HighlightChordLyricStyle";
import { useEditingState } from "./InteractionContext";
import TextInput from "./TextInput";
import Token from "./Token";

const chordSymbolClassName = "ChordSymbol";

const blockChordSymbolClassName = "BlockChordSymbol";
const blockChordTargetClassName = "BlockChordTarget";

const ChordInput = withStyles((theme: Theme) => ({
    root: {
        fontFamily: "PoriChord",
        borderBottom: "solid",
        borderBottomColor: theme.palette.primary.main,
        borderBottomWidth: "2px",
        width: "4em",
    },
}))(TextInput);

const useFirstTokenStyle = {
    dragOver: makeStyles(
        dragOverChordLyricStyle({
            outline: (theme: Theme) => ({
                borderColor: red[300],
                color: red[300],
            }),
            customLyricClassSelector: firstTokenClassName,
            customChordSymbolClassSelector: blockChordSymbolClassName,
            customChordTargetClassSelector: blockChordTargetClassName,
        })
    ),
    hoverable: makeStyles(
        hoverChordLyricStyle({
            outline: (theme: Theme) => ({
                color: theme.palette.primary.dark,
            }),
            customLyricClassSelector: firstTokenClassName,
            customChordSymbolClassSelector: blockChordSymbolClassName,
            customChordTargetClassSelector: blockChordTargetClassName,
        })
    ),
};

const useNormalTokenStyle = {
    dragOver: makeStyles(dragOverChordLyricStyle()),
    hoverable: makeStyles(hoverChordLyricStyle()),
};

export interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordDragAndDrop?: (
        destinationBlockID: IDable<ChordBlock>,
        splitIndex: number,
        newChord: string,
        sourceBlockID: IDable<ChordBlock>,
        copyAction: boolean
    ) => void;
    onChordChange?: (id: IDable<ChordBlock>, newChord: string) => void;
    onBlockSplit?: (id: IDable<ChordBlock>, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();

    let lyricTokens: Lyric[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [new Lyric(inflatingWhitespace())];
    }

    const firstTokenStyle = {
        hoverable: useFirstTokenStyle.hoverable(),
        dragOver: useFirstTokenStyle.dragOver(),
    };

    const normalTokenStyle = {
        hoverable: useNormalTokenStyle.hoverable(),
        dragOver: useNormalTokenStyle.dragOver(),
    };

    const invisibleTargetForFirstToken: boolean =
        props.chordBlock.chord === "" && !editing;

    const clickHandler: (
        tokenIndex: number
    ) => (event: React.MouseEvent<HTMLSpanElement>) => void = (
        tokenIndex: number
    ) => {
        return (event: React.MouseEvent<HTMLSpanElement>) => {
            // block splitting happens after the first token
            // as first token is already aligned with the current chord
            if (tokenIndex !== 0 && props.onBlockSplit) {
                props.onBlockSplit(props.chordBlock, tokenIndex);
            }

            startEdit();

            event.stopPropagation();
        };
    };

    const handleDragged = () => {
        props.onChordChange?.(props.chordBlock, "");
    };

    const dropHandler = (tokenIndex: number) => {
        return (
            newChord: string,
            sourceBlockID: IDable<ChordBlock>,
            copyAction: boolean
        ) => {
            props.onChordDragAndDrop?.(
                props.chordBlock,
                tokenIndex,
                newChord,
                sourceBlockID,
                copyAction
            );
        };
    };

    const endEdit = (newChord: string) => {
        props.onChordChange?.(props.chordBlock, newChord);

        finishEdit();
    };

    const lyricBlock = (lyric: Lyric, index: number): React.ReactElement => {
        // every above lyric target above after the first should get its own highlightable outline chord target box
        // the first one will depend if it has a chord above it.
        // if it does not, then treat it the same as all other tokens
        // if it does, then don't let it be highlightable, defer it to the chord row for highlighting
        const hasInvisibleTarget = index > 0 || invisibleTargetForFirstToken;

        const invisibleTargetOption = hasInvisibleTarget
            ? {
                  onClick: clickHandler(index),
              }
            : undefined;

        return (
            <ChordDroppable
                key={index}
                onDropped={dropHandler(index)}
                hoverableClassName={normalTokenStyle.hoverable.root}
                dragOverClassName={normalTokenStyle.dragOver.root}
            >
                <Token index={index} invisibleTarget={invisibleTargetOption}>
                    {lyric}
                </Token>
            </ChordDroppable>
        );
    };

    const lyricBlocks = lyricTokens.map((lyricToken: Lyric, index: number) =>
        lyricBlock(lyricToken, index)
    );

    const chordRow = (): JSX.Element => {
        if (editing) {
            return (
                <Box data-testid="ChordEdit">
                    <ChordInput
                        variant={lyricTypographyVariant}
                        onFinish={endEdit}
                    >
                        {props.chordBlock.chord}
                    </ChordInput>
                </Box>
            );
        }

        return (
            <DraggableChordSymbol
                chordBlockID={props.chordBlock}
                onDragged={handleDragged}
                className={clsx(
                    chordSymbolClassName,
                    blockChordSymbolClassName
                )}
            >
                {props.chordBlock.chord}
            </DraggableChordSymbol>
        );
    };

    return (
        <Box display="inline-block">
            <ChordDroppable
                onDropped={dropHandler(0)}
                hoverableClassName={firstTokenStyle.hoverable.root}
                dragOverClassName={firstTokenStyle.dragOver.root}
            >
                <Grid
                    container
                    direction="column"
                    data-testid={props["data-testid"]}
                >
                    <Grid
                        className={clsx(
                            chordTargetClassName,
                            blockChordTargetClassName
                        )}
                        onClick={clickHandler(0)}
                        item
                    >
                        {chordRow()}
                    </Grid>
                    <Grid item data-testid="Lyric">
                        {lyricBlocks}
                    </Grid>
                </Grid>
            </ChordDroppable>
        </Box>
    );
};

export default Block;
