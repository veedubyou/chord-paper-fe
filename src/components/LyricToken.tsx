import { Box, Theme, withStyles, Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core";
import { DataTestID } from "../common/DataTestID";
import { isWhitespace } from "../common/Whitespace";

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

interface LyricTokenProps
    extends Omit<TypographyProps, "variant" | "display">,
        DataTestID {
    children: string;
}

const LyricToken: React.FC<LyricTokenProps> = (
    props: LyricTokenProps
): JSX.Element => {
    const typographyProps = {
        variant: lyricTypographyVariant,
        display: "inline" as "inline",
    };

    const TypographyComponent = isWhitespace(props.children)
        ? SpaceTypography
        : WordTypography;

    const styleFirstToken = blockHasChord && index === 0;

    const lyricBlock = (
        <Typography
            {...typographyProps}
            className={lyricClass}
            data-testid={`Token-${index}`}
        >
            {lyric}
        </Typography>
    );
};
