import { Typography, withStyles, Theme, Grid } from "@material-ui/core";
import React, { useState } from "react";

import { DataTestID } from "../common/DataTestID";
import { isWhitespace, inflateIfEmpty } from "../common/Whitespace";
import { tokenize } from "../common/LyricTokenizer";
import { ChordBlock } from "../common/ChordModels";
import ChordSymbol from "./ChordSymbol";
import { IDable } from "../common/Collection";
import EditableLine from "./EditableLine";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
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
    const lyric = inflateIfEmpty(props.chordBlock.lyric);
    const lyricTokens = tokenize(lyric);

    const clickHandler = () => {
        setEditing(true);
    };

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const typographyProps = {
            key: index,
            variant: "h5" as "h5",
            display: "inline" as "inline",
            onClick: clickHandler,
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
        chordRow = (
            <ChordSymbol data-testid="Chord">
                {props.chordBlock.chord}
            </ChordSymbol>
        );
    } else {
        chordRow = (
            <EditableLine
                width="5em"
                onFinish={endEdit}
                data-testid="ChordEdit"
            >
                {props.chordBlock.chord}
            </EditableLine>
        );
    }

    return (
        <Grid
            container
            direction="column"
            component="span"
            data-testid={props["data-testid"]}
        >
            <Grid item onClick={clickHandler}>
                {chordRow}
            </Grid>
            <Grid item data-testid="Lyric">
                <>{lyricBlocks}</>
            </Grid>
        </Grid>
    );
};

export default Block;
