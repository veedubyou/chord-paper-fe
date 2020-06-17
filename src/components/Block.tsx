import { Box, Grid, Theme, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { IDable } from "../common/ChordModel/Collection";
import { DataTestID } from "../common/DataTestID";
import { inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import TextInput from "./TextInput";
import LyricToken, {
    lyricTypographyVariant,
    chordOutline,
    ChordOutlineBox,
} from "./LyricToken";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const HighlightableChordBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover .MuiTypography-root": {
            ...chordOutline(theme),
            color: theme.palette.primary.dark,
        },
    },
}))(Box);

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

    // render a transparent target if there's no chord
    // if there is a chord, allow the chord component to render its own outline box
    const renderTransparentTargetForFirstToken =
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

        let transparentTarget: React.ReactElement | null = null;

        // first token may be skipped because it's handled by the focusable elem on the chord row
        // hovering over that will give a better outlining because it will outline the chord that exists
        // rather than the width of the lyrics
        if (index > 0 || renderTransparentTargetForFirstToken) {
            transparentTarget = (
                <ChordOutlineBox
                    onMouseOver={() => highlight(index)}
                    onMouseOut={() => unhighlight(index)}
                    onClick={clickHandler(index)}
                >
                    {lyric}
                </ChordOutlineBox>
            );
        }

        return (
            <Box
                key={index}
                position="relative"
                display="inline"
                data-testid={`TokenBox-${index}`}
            >
                {lyricBlock}
                {transparentTarget}
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

        if (renderTransparentTargetForFirstToken) {
            return <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>;
        }

        return (
            <HighlightableChordBox
                onClick={clickHandler(0)}
                onMouseOver={() => highlight(0)}
                onMouseOut={() => unhighlight(0)}
            >
                <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>
            </HighlightableChordBox>
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
