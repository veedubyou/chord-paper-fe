import { Typography, withStyles, Theme, Grid } from "@material-ui/core";
import React from "react";

import { DataTestID } from "../common/DataTestID";
import { isWhitespace, inflateIfEmpty } from "../common/Whitespace";
import { tokenize } from "../common/LyricTokenizer";
import { ChordBlock } from "../common/ChordModels";
import ChordSymbol from "./ChordSymbol";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
}

const HighlightableWord = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.secondary.main,
        },
    },
}))(Typography);

const HighlightableSpace = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        "&:hover": {
            backgroundColor: theme.palette.secondary.light,
        },
    },
}))(Typography);

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const typographyProps = {
            key: index,
            variant: "h5" as "h5",
            display: "inline" as "inline",
        };

        if (isWhitespace(lyric)) {
            return (
                <HighlightableSpace {...typographyProps}>
                    {lyric}
                </HighlightableSpace>
            );
        } else {
            return (
                <HighlightableWord {...typographyProps}>
                    {lyric}
                </HighlightableWord>
            );
        }
    };

    const lyricBlocks = (): React.ReactElement[] => {
        const lyric = inflateIfEmpty(props.chordBlock.lyric);
        const lyricTokens = tokenize(lyric);

        return lyricTokens.map((lyricToken: string, index: number) =>
            lyricBlock(lyricToken, index)
        );
    };

    return (
        <Grid
            container
            direction="column"
            component="span"
            data-testid={props["data-testid"]}
        >
            <Grid item>
                <ChordSymbol data-testid="Chord">
                    {props.chordBlock.chord}
                </ChordSymbol>
            </Grid>
            <Grid item data-testid="Lyric">
                <>{lyricBlocks()}</>
            </Grid>
        </Grid>
    );
};

export default Block;
