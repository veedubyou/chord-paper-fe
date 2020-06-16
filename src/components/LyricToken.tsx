import { Box, Theme, withStyles, Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core";

export const lyricTypographyVariant: "h6" = "h6";

const SpaceTypography = withStyles((theme: Theme) => ({
    root: {
        ".ChordHovered": {
            backgroundColor: theme.palette.primary.main,
        },
        wordSpacing: ".15em",
    },
}))(Typography);

const WordTypography = withStyles((theme: Theme) => ({
    root: {
        ".ChordHovered": {
            color: theme.palette.primary.main,
        },
    },
}))(Typography);

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

interface LyricTokenProps extends TypographyProps {
    children: string;
}

const LyricToken: React.FC<{}> = (): JSX.Element => {};
