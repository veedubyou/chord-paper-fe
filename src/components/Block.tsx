import { Box, Grid, Theme } from "@material-ui/core";
import React, { useState } from "react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { IDable } from "../common/ChordModel/Collection";
import { DataTestID } from "../common/DataTestID";
import { inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import { lyricTypographyVariant } from "./LyricToken";
import TextInput from "./TextInput";
import Token from "./Token";
import { withStyles } from "@material-ui/styles";
import {
    withChordLyricStyle,
    firstTokenClassName,
    chordTargetClassName,
} from "./HighlightChordLyricStyle";
import clsx from "clsx";
const chordSymbolClassName = "ChordSymbol";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);

    let lyricTokens: string[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [inflatingWhitespace()];
    }

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
            event.stopPropagation();
        };
    };

    const invisibleTargetForFirstToken: boolean =
        props.chordBlock.chord === "" && !editing;

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
            <Token
                key={index}
                index={index}
                invisibleTarget={invisibleTargetOption}
            >
                {lyric}
            </Token>
        );
    };

    const lyricBlocks = lyricTokens.map((lyricToken: string, index: number) =>
        lyricBlock(lyricToken, index)
    );

    const endEdit = (newChord: string) => {
        if (props.onChordChange) {
            props.onChordChange(props.chordBlock, newChord);
        }

        setEditing(false);
    };

    const blockChordSymbolClassName = "BlockChordSymbol";
    const blockChordTargetClassName = "BlockChordTarget";

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
            <ChordSymbol
                className={clsx(
                    chordSymbolClassName,
                    blockChordSymbolClassName
                )}
            >
                {props.chordBlock.chord}
            </ChordSymbol>
        );
    };

    const NewGrid = withChordLyricStyle({
        outline: (theme: Theme) => ({
            color: theme.palette.primary.dark,
        }),
        customLyricClassSelector: firstTokenClassName,
        customChordSymbolClassSelector: blockChordSymbolClassName,
        customChordTargetClassSelector: blockChordTargetClassName,
    })(Grid);

    return (
        <Box display="inline-block">
            <NewGrid
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
            </NewGrid>
        </Box>
    );
};

export default Block;
