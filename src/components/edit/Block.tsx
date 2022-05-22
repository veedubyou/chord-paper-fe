import { Box, Grid, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { withStyles } from "@mui/styles";
import clsx from "clsx";
import { List } from "immutable";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { DataTestID } from "../../common/DataTestID";
import { inflatingWhitespace } from "../../common/Whitespace";
import ChordSymbol from "../display/ChordSymbol";
import { lyricTypographyVariant } from "../display/Lyric";
import { ChordSongAction } from "../reducer/reducer";
import ChordlessTokenDroppable from "./block-dnd/ChordlessTokenDroppable";
import ChordTokenDroppable from "./block-dnd/ChordTokenDroppable";
import DraggableChordSymbol from "./block-dnd/DraggableChordSymbol";
import { useChordTokenDragState } from "./block-dnd/useChordTokenDragState";
import {
    chordTargetClassName,
    dragOverChordLyricStyle,
    firstTokenClassName,
    hoverChordLyricStyle,
} from "./HighlightChordLyricStyle";
import { useEditingState } from "./InteractionContext";
import TextInput from "./TextInput";
import Token from "./Token";
import { red } from '@mui/material/colors';

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
    songDispatch: React.Dispatch<ChordSongAction>;

    onChordChange: (id: IDable<ChordBlock>, newChord: string) => void;
    onBlockSplit: (id: IDable<ChordBlock>, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const chordTokenStyle = {
        hoverable: useFirstTokenStyle.hoverable(),
        dragOver: useFirstTokenStyle.dragOver(),
    };

    const chordlessTokenStyle = {
        hoverable: useNormalTokenStyle.hoverable(),
        dragOver: useNormalTokenStyle.dragOver(),
    };
    const { editing, startEdit, finishEdit } = useEditingState();

    const [gridClassName, onChordDragOver, onLyricDragOver] =
        useChordTokenDragState(
            chordTokenStyle.hoverable.root,
            chordTokenStyle.dragOver.root
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
                <Token index={0}>{lyric}</Token>
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
                hoverableClassName={chordlessTokenStyle.hoverable.root}
                dragOverClassName={chordlessTokenStyle.dragOver.root}
            >
                <Token index={index} invisibleTarget={invisibleTargetOption}>
                    {lyric}
                </Token>
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

    const chordRow: React.ReactElement = (() => {
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
            return <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>;
        }

        return (
            <DraggableChordSymbol
                chordBlockID={props.chordBlock}
                onDrop={onDrop}
                className={clsx(
                    chordSymbolClassName,
                    blockChordSymbolClassName
                )}
            >
                {props.chordBlock.chord}
            </DraggableChordSymbol>
        );
    })();

    return (
        <Box display="inline-block">
            <Grid
                container
                direction="column"
                data-testid={props["data-testid"]}
                className={gridClassName}
            >
                <Grid
                    className={clsx(
                        chordTargetClassName,
                        blockChordTargetClassName
                    )}
                    onClick={clickHandler(0)}
                    item
                >
                    <ChordTokenDroppable
                        blockID={props.chordBlock}
                        onDragOver={onChordDragOver}
                    >
                        {chordRow}
                    </ChordTokenDroppable>
                </Grid>
                <Grid item data-testid="Lyric">
                    {lyricBlocks}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Block;
