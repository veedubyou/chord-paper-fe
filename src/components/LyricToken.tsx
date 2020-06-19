import React from "react";
import { Theme, withStyles, Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core";
import { DataTestID } from "../common/DataTestID";
import { isWhitespace } from "../common/Whitespace";
import { outline } from "./Outline";

export const lyricTypographyVariant: "h6" = "h6";

const LyricTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        wordSpacing: ".15em",
    },
}))(Typography);

const InvisibleTypography = withStyles({
    root: {
        color: "transparent",
        cursor: "pointer",
        userSelect: "none",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(0%, -115%)",
    },
})(LyricTypography);

const OutlineTypography = withStyles((theme: Theme) => ({
    root: {
        "&:hover": outline(theme),
    },
}))(InvisibleTypography);

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

interface ChordTargetBoxProps {
    children: string;
    highlightable?: boolean;
    onMouseOver?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    onMouseOut?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export const ChordTargetBox: React.FC<ChordTargetBoxProps> = (
    props: ChordTargetBoxProps
): JSX.Element => {
    const typographyComponent = (): React.ComponentType<TypographyProps> => {
        if (props.highlightable === true) {
            return OutlineTypography;
        }

        return InvisibleTypography;
    };

    const TypographyComponent = typographyComponent();

    return (
        <TypographyComponent
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
            onMouseOut={props.onMouseOut}
            {...lyricTypographyProps}
            data-testid="ChordEditButton"
        >
            {props.children}
        </TypographyComponent>
    );
};

interface LyricTokenProps extends DataTestID {
    children: string;
    highlight?: boolean;
}

const LyricToken: React.FC<LyricTokenProps> = (
    props: LyricTokenProps
): JSX.Element => {
    const typographyComponent = (): React.ComponentType<TypographyProps> => {
        if (props.highlight !== true) {
            return LyricTypography;
        }

        if (isWhitespace(props.children)) {
            return HighlightedSpaceTypography;
        }

        return HighlightedWordTypography;
    };

    const TypographyComponent = typographyComponent();

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
