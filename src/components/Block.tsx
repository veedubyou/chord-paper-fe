import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { IDable } from "../common/ChordModel/Collection";
import { DataTestID } from "../common/DataTestID";
import { inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import TextInput from "./TextInput";
import LyricToken, {
    lyricTypographyVariant,
    ChordTargetBox,
} from "./LyricToken";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [highlightTokenIndex, setHighlightTokenIndex] = useState<
        number | null
    >(null);

    let lyricTokens: string[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [inflatingWhitespace()];
    }

    const highlight = (index: number) => {
        if (index === highlightTokenIndex) {
            return;
        }

        setHighlightTokenIndex(index);
    };

    const unhighlight = (index: number) => {
        // don't misfire and unhighlight a different token
        if (index !== highlightTokenIndex) {
            return;
        }

        setHighlightTokenIndex(null);
    };

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

    const renderOutlinedTargetForFirstToken: boolean =
        props.chordBlock.chord === "" && !editing;

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const highlightLyric = highlightTokenIndex === index;

        const lyricBlock = (
            <LyricToken
                highlight={highlightLyric}
                data-testid={`Token-${index}`}
            >
                {lyric}
            </LyricToken>
        );

        // every above lyric target above after the first should get its own highlightable outline chord target box
        // the first one will depend if it has a chord above it.
        // if it does not, then treat it the same as all other tokens
        // if it does, then don't let it be highlightable, defer it to the chord row for highlighting
        const targetHighlightable =
            index > 0 || renderOutlinedTargetForFirstToken;

        const invisibleTarget = (
            <ChordTargetBox
                highlightable={targetHighlightable}
                onMouseOver={() => highlight(index)}
                onMouseOut={() => unhighlight(index)}
                onClick={clickHandler(index)}
            >
                {lyric}
            </ChordTargetBox>
        );

        return (
            <Box
                key={index}
                position="relative"
                display="inline"
                data-testid={`TokenBox-${index}`}
            >
                {lyricBlock}
                {invisibleTarget}
            </Box>
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

        if (renderOutlinedTargetForFirstToken) {
            return <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>;
        }

        return (
            <ChordSymbol highlight={highlightTokenIndex === 0}>
                {props.chordBlock.chord}
            </ChordSymbol>
        );
    };

    return (
        <Box display="inline-block">
            <Grid
                container
                direction="column"
                component="span"
                data-testid={props["data-testid"]}
            >
                <Grid item>{chordRow()}</Grid>
                <Grid item data-testid="Lyric">
                    {lyricBlocks}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Block;
