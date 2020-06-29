import { Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { DataTestID } from "../../common/DataTestID";
import { isWhitespace } from "../../common/Whitespace";
import {
    spaceClassName,
    wordClassName,
} from "../edit/HighlightChordLyricStyle";

export const lyricTypographyVariant: "h6" = "h6";

export const lyricTypographyProps = {
    variant: lyricTypographyVariant,
    display: "inline" as "inline",
};

export const LyricTypography = withStyles({
    root: {
        tabSize: 16,
        whiteSpace: "pre",
        wordSpacing: ".15em",
        display: "inline-block",
    },
})(Typography);

interface LyricProps extends DataTestID {
    children: string;
    className?: string;
}

const Lyric: React.FC<LyricProps> = (props: LyricProps): JSX.Element => {
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

export default Lyric;
