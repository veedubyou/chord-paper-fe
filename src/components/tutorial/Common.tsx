import { styled, Typography } from "@mui/material";
import { inflatingWhitespace } from "common/Whitespace";
import React from "react";
export const LyricsTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.light,
}));

export const ChordTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

export const LineBreak = () => {
    return <Typography>{inflatingWhitespace()}</Typography>;
};
