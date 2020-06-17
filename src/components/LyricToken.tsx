import React from "react";
import { Theme, withStyles, Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core";
import { DataTestID } from "../common/DataTestID";
import { isWhitespace } from "../common/Whitespace";

export const lyricTypographyVariant: "h6" = "h6";

export const chordOutline = (theme: Theme) => ({
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "0.3em",
    borderWidth: "0.075em",
});

const LyricTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        wordSpacing: ".15em",
    },
}))(Typography);

const ChordOutlineTypography = withStyles((theme: Theme) => ({
    root: {
        color: "transparent",
        cursor: "pointer",
        userSelect: "none",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(0%, -115%)",
        "&:hover": chordOutline(theme),
    },
}))(LyricTypography);

const lyricTypographyProps = {
    variant: lyricTypographyVariant,
    display: "inline" as "inline",
};

const HighlightedSpaceTypography = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
    },
}))(LyricTypography);

const HighlightedWordTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(LyricTypography);

interface ChordOutlineBoxProps {
    children: string;
    onMouseOver?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    onMouseOut?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export const ChordOutlineBox: React.FC<ChordOutlineBoxProps> = (
    props: ChordOutlineBoxProps
): JSX.Element => {
    return (
        <ChordOutlineTypography
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            {...lyricTypographyProps}
            data-testid="ChordEditButton"
        >
            {props.children}
        </ChordOutlineTypography>
    );
};

interface LyricTokenProps extends DataTestID {
    children: string;
    highlight?: boolean;
}

const LyricToken: React.FC<LyricTokenProps> = (
    props: LyricTokenProps
): JSX.Element => {
    let TypographyComponent: React.ComponentType<TypographyProps>;
    if (props.highlight === true) {
        if (isWhitespace(props.children)) {
            TypographyComponent = HighlightedSpaceTypography;
        } else {
            TypographyComponent = HighlightedWordTypography;
        }
    } else {
        TypographyComponent = LyricTypography;
    }

    return (
        <TypographyComponent
            {...lyricTypographyProps}
            data-testid={props["data-testid"]}
        >
            {props.children}
        </TypographyComponent>
    );
};

export default LyricToken;
