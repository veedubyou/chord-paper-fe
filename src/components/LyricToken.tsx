import {
    StyledComponentProps,
    Theme,
    Typography,
    withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { DataTestID } from "../common/DataTestID";
import { isWhitespace } from "../common/Whitespace";
import { spaceClassName, wordClassName } from "./HighlightChordLyricStyle";

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

const lyricTypographyProps = {
    variant: lyricTypographyVariant,
    display: "inline" as "inline",
};

export const highlightedSpaceStyle = (theme: Theme) => ({
    backgroundColor: theme.palette.primary.main,
});

export const highlightedWordStyle = (theme: Theme) => ({
    color: theme.palette.primary.main,
});

export interface ChordTargetBoxProps extends StyledComponentProps {
    children: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export const ChordTargetBox: React.FC<ChordTargetBoxProps> = (
    props: ChordTargetBoxProps
): JSX.Element => {
    return (
        <InvisibleTypography
            {...lyricTypographyProps}
            onClick={props.onClick}
            classes={props.classes}
            className={props.className}
            data-testid="ChordEditButton"
        >
            {props.children}
        </InvisibleTypography>
    );
};

interface LyricTokenProps extends DataTestID {
    children: string;
    className?: string;
}

const LyricToken: React.FC<LyricTokenProps> = (
    props: LyricTokenProps
): JSX.Element => {
    const customClassName = props.className ?? "";

    const className = clsx({
        [spaceClassName]: isWhitespace(props.children),
        [wordClassName]: !isWhitespace(props.children),
        [customClassName]: props.className !== undefined,
    });

    return (
        <LyricTypography
            {...lyricTypographyProps}
            className={className}
            data-testid={props["data-testid"]}
        >
            {props.children}
        </LyricTypography>
    );
};

export default LyricToken;
