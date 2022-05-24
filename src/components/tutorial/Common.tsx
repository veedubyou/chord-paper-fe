import { styled, Typography } from "@mui/material";
import React from "react";
import { inflatingWhitespace } from "../../common/Whitespace";
export const LyricsTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.light,
}));

export const ChordTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

export const LineBreak = () => {
    return <Typography>{inflatingWhitespace()}</Typography>;
};
