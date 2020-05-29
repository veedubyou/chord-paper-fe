import { Typography, withStyles, Theme, Grid } from "@material-ui/core";
import React from "react";

import { DataTestID, generateTestID } from "../common/DataTestID";
import { isWhitespace, inflatingWhitespace, tokenize } from "../utils/util";
import { ChordBlock } from "../common/ChordLyric";

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

const inflateIfEmpty = (value: string) => {
    if (value.trim() === "") {
        return inflatingWhitespace();
    }

    return value;
};

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const testID = (suffix: string): string => {
        return generateTestID(props, suffix);
    };

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const typographyProps = {
            key: index,
            variant: "h5" as "h5",
            display: "inline" as "inline",
            // "data-testid": testID(`Token-${index}`),
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
        <Grid container direction="column" component="span">
            <Grid item>
                <Typography
                    variant="h5"
                    display="inline"
                    data-testid={testID("Chord")}
                >
                    {inflateIfEmpty(props.chordBlock.chord)}
                </Typography>
            </Grid>
            <Grid item data-testid={testID("Lyric")}>
                <>{lyricBlocks()}</>
            </Grid>
        </Grid>
    );
};

export default Block;
