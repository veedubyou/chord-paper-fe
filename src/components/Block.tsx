import {
    Typography as UnstyledTypography,
    withStyles,
    Theme,
    Grid,
    Box,
} from "@material-ui/core";
import React, { useState } from "react";

import { DataTestID } from "../common/DataTestID";
import { inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import { IDable } from "../common/ChordModel/Collection";
import TextInput from "./TextInput";
import { ChordBlock } from "../common/ChordModel/ChordBlock";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const ChordInsertOutline = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        color: "transparent",
        cursor: "pointer",
        userSelect: "none",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(0%, -115%)",
        "&:hover": {
            borderStyle: "solid",
            borderColor: theme.palette.primary.main,
            borderRadius: "0.3em",
            borderWidth: "0.075em",
        },
    },
}))(UnstyledTypography);

const Typography = withStyles({
    root: {
        whiteSpace: "pre",
    },
})(UnstyledTypography);

const HighlightableBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.primary.dark,
        },
    },
}))(Box);

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);

    let lyricTokens: string[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [inflatingWhitespace()];
    }

    const clickHandler: (
        tokenIndex: number
    ) => (event: React.MouseEvent<HTMLDivElement>) => void = (
        tokenIndex: number
    ) => {
        return (event: React.MouseEvent<HTMLDivElement>) => {
            // block splitting happens after the first token
            // as first token is already aligned with the current chord
            if (tokenIndex !== 0 && props.onBlockSplit) {
                props.onBlockSplit(props.chordBlock, tokenIndex);
            }

            setEditing(true);
            event.stopPropagation();
        };
    };

    const lyricBlock = (
        lyric: string,
        index: number,
        blockHasChord: boolean
    ): React.ReactElement => {
        const typographyProps = {
            variant: "h5" as "h5",
            display: "inline" as "inline",
        };

        const lyricBlock = (
            <Typography {...typographyProps} data-testid={`Token-${index}`}>
                {lyric}
            </Typography>
        );

        let hiddenTarget: React.ReactElement | null = null;

        if (!blockHasChord || index !== 0) {
            hiddenTarget = (
                <ChordInsertOutline
                    {...typographyProps}
                    onClick={clickHandler(index)}
                    data-testid="ChordEditButton"
                >
                    {lyric}
                </ChordInsertOutline>
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
                {hiddenTarget}
            </Box>
        );
    };

    const lyricBlocks = lyricTokens.map((lyricToken: string, index: number) =>
        lyricBlock(lyricToken, index, props.chordBlock.chord !== "")
    );

    const endEdit = (newChord: string) => {
        if (props.onChordChange) {
            props.onChordChange(props.chordBlock, newChord);
        }

        setEditing(false);
    };

    let chordRow: React.ReactElement;
    if (!editing) {
        chordRow = (
            <HighlightableBox onClick={clickHandler(0)}>
                <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>
            </HighlightableBox>
        );
    } else {
        chordRow = (
            <Box data-testid="ChordEdit">
                <TextInput width="5em" variant="h5" onFinish={endEdit}>
                    {props.chordBlock.chord}
                </TextInput>
            </Box>
        );
    }

    return (
        <Box display="inline-block">
            <Grid
                container
                direction="column"
                component="span"
                data-testid={props["data-testid"]}
            >
                <Grid item>{chordRow}</Grid>
                <Grid item data-testid="Lyric">
                    {lyricBlocks}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Block;
