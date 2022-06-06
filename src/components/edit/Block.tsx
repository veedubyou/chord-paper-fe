import { cx } from "@emotion/css";
import { Box, Grid, inputBaseClasses, styled, Theme } from "@mui/material";
import { red } from "@mui/material/colors";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { IDable } from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";
import { DataTestID } from "common/DataTestID";
import { inflatingWhitespace } from "common/Whitespace";
import ChordSymbol from "components/display/ChordSymbol";
import { lyricTypographyVariant } from "components/display/Lyric";
import ChordlessTokenDroppable from "components/edit/block-dnd/ChordlessTokenDroppable";
import ChordTokenDroppable from "components/edit/block-dnd/ChordTokenDroppable";
import DraggableChordSymbol from "components/edit/block-dnd/DraggableChordSymbol";
import { useChordTokenDragState } from "components/edit/block-dnd/useChordTokenDragState";
import {
    chordTargetClassName,
    firstTokenClassName,
    makeHighlightableBlockStyles
} from "components/edit/HighlightableBlockStyle";
import { useEditingState } from "components/edit/InteractionContext";
import TextInput from "components/edit/TextInput";
import Token from "components/edit/Token";
import { ChordSongAction } from "components/reducer/reducer";
import { List } from "immutable";
import React from "react";
import { ConnectDropTarget } from "react-dnd";

const chordSymbolClassName = "ChordSymbol";

const blockChordSymbolClassName = "BlockChordSymbol";
const blockChordTargetClassName = "BlockChordTarget";

// this height keeps the chords, the chord input, and lyrics the same height
// so that everything lines up
const rowHeight = "2em";

const ChordInput = styled(TextInput)({
    width: "4em",
    height: rowHeight,
    [`& .${inputBaseClasses.input}`]: {
        fontFamily: "PoriChord",
    },
});

const useFirstTokenStyle = makeHighlightableBlockStyles({
    dragOverOutline: (theme: Theme) => ({
        borderColor: red[300],
        color: red[300],
    }),
    hoverOutline: (theme: Theme) => ({
        color: theme.palette.primary.dark,
    }),
    customLyricClassSelector: firstTokenClassName,
    customChordSymbolClassSelector: blockChordSymbolClassName,
    customChordTargetClassSelector: blockChordTargetClassName,
});

const useNormalTokenStyle = makeHighlightableBlockStyles();

export interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    songDispatch: React.Dispatch<ChordSongAction>;

    onChordChange: (id: IDable<ChordBlock>, newChord: string) => void;
    onBlockSplit: (id: IDable<ChordBlock>, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const chordTokenStyle = useFirstTokenStyle();
    const chordlessTokenStyle = useNormalTokenStyle();

    const { editing, startEdit, finishEdit } = useEditingState();

    const [gridClassName, onChordDragOver, onLyricDragOver] =
        useChordTokenDragState(
            chordTokenStyle.hoverable,
            chordTokenStyle.dragOver
        );

    let lyricTokens: List<Lyric> = props.chordBlock.lyricTokens;

    if (lyricTokens.size === 0) {
        const whitespaceLyric = new Lyric(inflatingWhitespace());
        lyricTokens = List([whitespaceLyric]);
    }

    const clickHandler: (
        tokenIndex: number
    ) => (event: React.MouseEvent<HTMLSpanElement>) => void = (
        tokenIndex: number
    ) => {
        return (event: React.MouseEvent<HTMLSpanElement>) => {
            // block splitting happens after the first token
            // as first token is already aligned with the current chord
            if (tokenIndex !== 0) {
                props.onBlockSplit(props.chordBlock, tokenIndex);
            }

            startEdit();

            event.stopPropagation();
        };
    };

    const onDrop = (params: {
        chord: string;
        sourceBlockID: IDable<ChordBlock>;
        destinationBlockID: IDable<ChordBlock>;
        splitIndex: number;
        dropType: "move" | "copy";
    }) => {
        props.songDispatch({
            type: "drag-and-drop-chord",
            sourceBlockID: params.sourceBlockID,
            newChord: params.chord,
            dropType: params.dropType,
            destinationBlockID: params.destinationBlockID,
            splitIndex: params.splitIndex,
        });
    };

    const endEdit = (newChord: string) => {
        props.onChordChange?.(props.chordBlock, newChord);

        finishEdit();
    };

    const makeFirstToken = (lyric: Lyric): React.ReactElement => {
        const blockHasChord = props.chordBlock.chord !== "";
        if (!blockHasChord) {
            return makeChordlessToken(lyric, 0);
        }

        return (
            <ChordTokenDroppable
                key={0}
                blockID={props.chordBlock}
                onDragOver={onLyricDragOver}
            >
                {(dropRef: ConnectDropTarget) => (
                    <Token index={0} ref={dropRef}>
                        {lyric}
                    </Token>
                )}
            </ChordTokenDroppable>
        );
    };

    const makeChordlessToken = (
        lyric: Lyric,
        index: number
    ): React.ReactElement => {
        const invisibleTargetOption = {
            onClick: clickHandler(index),
        };

        return (
            <ChordlessTokenDroppable
                key={index}
                blockID={props.chordBlock}
                tokenIndex={index}
                hoverableClassName={chordlessTokenStyle.hoverable}
                dragOverClassName={chordlessTokenStyle.dragOver}
            >
                {(dropRef: ConnectDropTarget) => (
                    <Token
                        index={index}
                        invisibleTarget={invisibleTargetOption}
                        ref={dropRef}
                    >
                        {lyric}
                    </Token>
                )}
            </ChordlessTokenDroppable>
        );
    };

    const firstLyricToken = lyricTokens.get(0);
    if (firstLyricToken === undefined) {
        throw new Error("Lyric tokens list guaranteed at least one token");
    }

    const subsequentLyricTokens = lyricTokens.slice(1);

    const firstLyricBlock = makeFirstToken(firstLyricToken);
    const subsequentLyricBlocks = subsequentLyricTokens.map(
        (lyricToken: Lyric, index: number) =>
            makeChordlessToken(lyricToken, index + 1)
    );

    const lyricBlocks = subsequentLyricBlocks.unshift(firstLyricBlock);

    const chordRow = (dropRef: ConnectDropTarget) => {
        if (editing) {
            return (
                <Box data-testid="ChordEdit">
                    <ChordInput
                        value={props.chordBlock.chord}
                        variant="filled"
                        typographyVariant={lyricTypographyVariant}
                        onFinish={endEdit}
                    />
                </Box>
            );
        }

        if (props.chordBlock.chord === "") {
            return (
                <ChordSymbol ref={dropRef}>
                    {props.chordBlock.chord}
                </ChordSymbol>
            );
        }

        return (
            <DraggableChordSymbol
                chordBlockID={props.chordBlock}
                onDrop={onDrop}
                className={cx(chordSymbolClassName, blockChordSymbolClassName)}
                ref={dropRef}
            >
                {props.chordBlock.chord}
            </DraggableChordSymbol>
        );
    };

    return (
        <Box display="inline-block" sx={{ verticalAlign: "bottom" }}>
            <Grid
                container
                direction="column"
                data-testid={props["data-testid"]}
                className={gridClassName}
            >
                <Grid
                    className={cx(
                        chordTargetClassName,
                        blockChordTargetClassName
                    )}
                    onClick={clickHandler(0)}
                    height={rowHeight}
                    item
                >
                    <ChordTokenDroppable
                        blockID={props.chordBlock}
                        onDragOver={onChordDragOver}
                    >
                        {chordRow}
                    </ChordTokenDroppable>
                </Grid>
                <Grid item height={rowHeight} data-testid="Lyric">
                    {lyricBlocks}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Block;
