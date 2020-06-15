import {
    Box,
    Grid,
    Theme,
    Typography as UnstyledTypography,
    withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { IDable } from "../common/ChordModel/Collection";
import { DataTestID } from "../common/DataTestID";
import { inflatingWhitespace, isWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import TextInput from "./TextInput";
import { lyricTypographyVariant, HighlightableTokenBox } from "./Lyric";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const chordOutline = (theme: Theme) => ({
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "0.3em",
    borderWidth: "0.075em",
});

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
        "&:hover": chordOutline(theme),
    },
}))(UnstyledTypography);

const Typography = withStyles({
    root: {
        whiteSpace: "pre",
    },
})(UnstyledTypography);

const HighlightableChordBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.primary.dark,
        },
        "&:hover .MuiTypography-root": chordOutline(theme),
    },
}))(Box);

const HighlightableBlockBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover .HighlightLyric": {
            color: theme.palette.primary.main,
        },
        "&:hover .HighlightSpace": {
            backgroundColor: theme.palette.primary.main,
        },
    },
}))(Box);

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [hoveringOverChord, setHoveringOverChord] = useState(false);

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
            variant: lyricTypographyVariant,
            display: "inline" as "inline",
        };

        const styleFirstToken = blockHasChord && index === 0;

        let lyricClass: string;
        if (styleFirstToken && hoveringOverChord) {
            if (isWhitespace(lyric)) {
                lyricClass = "HighlightSpace";
            } else {
                lyricClass = "HighlightLyric";
            }
        } else {
            if (isWhitespace(lyric)) {
                lyricClass = "Space";
            } else {
                lyricClass = "Lyric";
            }
        }

        const lyricBlock = (
            <Typography
                {...typographyProps}
                className={lyricClass}
                data-testid={`Token-${index}`}
            >
                {lyric}
            </Typography>
        );

        let hiddenTarget: React.ReactElement | null = null;

        if (!styleFirstToken) {
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
            <HighlightableTokenBox
                key={index}
                position="relative"
                display="inline"
                data-testid={`TokenBox-${index}`}
            >
                {lyricBlock}
                {hiddenTarget}
            </HighlightableTokenBox>
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
            <HighlightableChordBox
                onClick={clickHandler(0)}
                onMouseOver={() => setHoveringOverChord(true)}
                onMouseOut={() => setHoveringOverChord(false)}
            >
                <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>
            </HighlightableChordBox>
        );
    } else {
        chordRow = (
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
        <HighlightableBlockBox display="inline-block">
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
        </HighlightableBlockBox>
    );
};

export default Block;
