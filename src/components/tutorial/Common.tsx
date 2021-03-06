import { Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { inflatingWhitespace } from "../../common/Whitespace";
export const LyricsTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.light,
    },
}))(Typography);

export const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(Typography);

export const LineBreak = () => {
    return <Typography>{inflatingWhitespace()}</Typography>;
};
