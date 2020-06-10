import {
    Typography,
    withStyles,
    Theme,
    Grid,
    Box,
    Tooltip as UnstyledTooltip,
    Button,
} from "@material-ui/core";
import React, { useState } from "react";

import { DataTestID } from "../common/DataTestID";
import { isWhitespace, inflatingWhitespace } from "../common/Whitespace";
import ChordSymbol from "./ChordSymbol";
import { IDable } from "../common/ChordModel/Collection";
import TextInput from "./TextInput";
import { ChordBlock } from "../common/ChordModel/ChordBlock";
import { fade } from "@material-ui/core/styles/colorManipulator";
import UnstyledMusicNoteRoundedIcon from "@material-ui/icons/MusicNoteRounded";

interface BlockProps extends DataTestID {
    chordBlock: ChordBlock;
    onChordChange?: (id: IDable<"ChordBlock">, newChord: string) => void;
    onBlockSplit?: (id: IDable<"ChordBlock">, splitIndex: number) => void;
}

const MusicNoteRoundedIcon = withStyles({
    root: {
        color: "white",
    },
})(UnstyledMusicNoteRoundedIcon);

const Tooltip = withStyles((theme: Theme) => ({
    tooltip: {
        padding: 0,
        background: fade(theme.palette.secondary.light, 0.9),
        margin: 0,
    },
}))(UnstyledTooltip);

const WordTarget = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.primary.main,
        },
        cursor: "pointer",
    },
}))(Typography);

const SpaceTarget = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
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

    const clickHandler: (
        tokenIndex: number
    ) => (event: React.MouseEvent<HTMLButtonElement>) => void = (
        tokenIndex: number
    ) => {
        return (event: React.MouseEvent<HTMLButtonElement>) => {
            // block splitting happens after the first token
            // as first token is already aligned with the current chord
            if (tokenIndex !== 0 && props.onBlockSplit) {
                props.onBlockSplit(props.chordBlock, tokenIndex);
            }

            setEditing(true);
            event.stopPropagation();
        };
    };

    const lyricBlock = (lyric: string, index: number): React.ReactElement => {
        const typographyProps = {
            variant: "h5" as "h5",
            display: "inline" as "inline",
            "data-testid": `Token-${index}`,
        };

        const chordButton = (
            <Button onClick={clickHandler(index)} data-testid="ChordEditButton">
                <MusicNoteRoundedIcon />
            </Button>
        );

        let lyricBlock: React.ReactElement;
        if (isWhitespace(lyric)) {
            lyricBlock = (
                <SpaceTarget {...typographyProps}>{lyric}</SpaceTarget>
            );
        } else {
            lyricBlock = <WordTarget {...typographyProps}>{lyric}</WordTarget>;
        }

        return (
            <Tooltip
                key={index}
                title={chordButton}
                placement="top-start"
                disableFocusListener={true}
                interactive
            >
                {lyricBlock}
            </Tooltip>
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

    let chordRow: React.ReactElement;
    if (!editing) {
        chordRow = (
            <Box onClick={clickHandler(0)}>
                <ChordSymbol>{props.chordBlock.chord}</ChordSymbol>
            </Box>
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
                    <>{lyricBlocks}</>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Block;
