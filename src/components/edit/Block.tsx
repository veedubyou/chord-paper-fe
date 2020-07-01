import { Box, Grid, makeStyles, Theme } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import clsx from "clsx";
import React, { useState, useContext } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { IDable } from "../../common/ChordModel/Collection";
import { DataTestID } from "../../common/DataTestID";
import { inflatingWhitespace } from "../../common/Whitespace";
import ChordDroppable from "./ChordDroppable";
import DraggableChordSymbol from "./DraggableChordSymbol";
import {
    chordTargetClassName,
    dragOverChordLyricStyle,
    firstTokenClassName,
    hoverChordLyricStyle,
} from "./HighlightChordLyricStyle";
import { lyricTypographyVariant } from "../display/Lyric";
import TextInput from "./TextInput";
import Token from "./Token";
import { InteractionContext } from "./InteractionContext";

const chordSymbolClassName = "ChordSymbol";

const blockChordSymbolClassName = "BlockChordSymbol";
const blockChordTargetClassName = "BlockChordTarget";

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
        destinationBlockID: IDable<"ChordBlock">,
        splitIndex: number,
        newChord: string,
        sourceBlockID: IDable<"ChordBlock">
    ) => void;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const { startInteraction, endInteraction } = useContext(InteractionContext);

    let lyricTokens: string[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [inflatingWhitespace()];
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

            setEditing(true);
            startInteraction();

            event.stopPropagation();
        };
    };

    const handleDragged = () => {
        if (props.onChordChange) {
            props.onChordChange(props.chordBlock, "");
        }
    };

    const dropHandler = (tokenIndex: number) => {
        return (newChord: string, sourceBlockID: IDable<"ChordBlock">) => {
            if (props.onChordDragAndDrop) {
                props.onChordDragAndDrop(
                    props.chordBlock,
                    tokenIndex,
                    newChord,
                    sourceBlockID
                );
            }
        };
    };

    const endEdit = (newChord: string) => {
        if (props.onChordChange) {
            props.onChordChange(props.chordBlock, newChord);
        }

        setEditing(false);
        endInteraction();
    };

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
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

    const lyricBlocks = lyricTokens.map((lyricToken: string, index: number) =>
        lyricBlock(lyricToken, index)
    );

    const chordRow = (): JSX.Element => {
        if (editing) {
            return (
                <Box data-testid="ChordEdit">
                    <TextInput
                        width="5em"
                        variant={lyricTypographyVariant}
                        onFinish={endEdit}
                    >
                        {props.chordBlock.chord}
                    </TextInput>
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
