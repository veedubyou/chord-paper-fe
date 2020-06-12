import React from "react";
import { Paper, Typography, Theme, Grid, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { inflatingWhitespace } from "../../../common/Whitespace";
import Playground from "./Playground";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";

export const ExerciseBox = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}))(Box);

export const LyricsTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(Typography);

export const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.light,
    },
}))(Typography);

export const LineBreak = () => {
    return <Typography>{inflatingWhitespace()}</Typography>;
};
