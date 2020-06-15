import { Box, Theme, withStyles } from "@material-ui/core";

export const lyricTypographyVariant: "h6" = "h6";

export const HighlightableTokenBox = withStyles((theme: Theme) => ({
    root: {
        "&:hover .Space": {
            backgroundColor: theme.palette.primary.main,
        },
        "&:hover .Lyric": {
            color: theme.palette.primary.main,
        },
        wordSpacing: ".15em",
    },
}))(Box);
