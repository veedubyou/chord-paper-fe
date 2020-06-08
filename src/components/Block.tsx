import { Typography, withStyles, Theme, Grid, Box } from "@material-ui/core";
import React, { useState } from "react";

import { DataTestID } from "../common/DataTestID";
import { isWhitespace, inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import { IDable } from "../common/ChordModel/Collection";
import EditableLine from "./EditableLine";
import { ChordBlock } from "../common/ChordModel/ChordBlock";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const WordTarget = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.secondary.main,
        },
        cursor: "pointer",
    },
}))(Typography);

const SpaceTarget = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        "&:hover": {
            backgroundColor: theme.palette.secondary.light,
        },
        cursor: "pointer",
    },
}))(Typography);

const Block: React.FC<BlockProps> = (props: BlockProps): JSX.Element => {
    const [editing, setEditing] = useState(false);

    let lyricTokens: string[] = props.chordBlock.lyricTokens;

    if (lyricTokens.length === 0) {
        lyricTokens = [inflatingWhitespace()];
    }

    const clickHandler = (tokenIndex: number): (() => void) => {
        return () => {
            // block splitting happens after the first token
            // as first token is already aligned with the current chord
            if (tokenIndex !== 0 && props.onBlockSplit) {
                props.onBlockSplit(props.chordBlock, tokenIndex);
            }

            setEditing(true);
        };
    };

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const typographyProps = {
            key: index,
            variant: "h5" as "h5",
            display: "inline" as "inline",
            onClick: clickHandler(index),
            "data-testid": `Token-${index}`,
        };

        if (isWhitespace(lyric)) {
            return <SpaceTarget {...typographyProps}>{lyric}</SpaceTarget>;
        } else {
            return <WordTarget {...typographyProps}>{lyric}</WordTarget>;
        }
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

    let chordRow: React.ReactElement;
    if (!editing) {
        chordRow = <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>;
    } else {
        chordRow = (
            <Box data-testid="ChordEdit">
                <EditableLine width="5em" variant="h5" onFinish={endEdit}>
                    {props.chordBlock.chord}
                </EditableLine>
            </Box>
        );
    }

    return (
        <Grid
            container
            direction="column"
            component="span"
            data-testid={props["data-testid"]}
        >
            <Grid item onClick={() => setEditing(true)}>
                {chordRow}
            </Grid>
            <Grid item data-testid="Lyric">
                <>{lyricBlocks}</>
            </Grid>
        </Grid>
    );
};

export default Block;
