import { createStyles, Typography, withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { Lyric } from "../../common/ChordModel/Lyric";
import { DataTestID } from "../../common/DataTestID";
import {
    spaceClassName,
    wordClassName,
} from "../edit/HighlightChordLyricStyle";
import { deserializeLyrics } from "../lyrics/Serialization";

export const lyricTypographyVariant: "h6" = "h6";

export const lyricTypographyProps = {
    variant: lyricTypographyVariant,
    display: "inline" as "inline",
};

export const lyricStyle = createStyles({
    root: {
        whiteSpace: "pre",
        wordSpacing: ".15em",
        display: "inline-block",
    },
});

export const LyricTypography = withStyles(lyricStyle)(Typography);

interface LyricTypographyProps extends DataTestID {
    children: Lyric;
    className?: string;
}

const LyricDisplay: React.FC<LyricTypographyProps> = (
    props: LyricTypographyProps
): JSX.Element => {
    const customClassName = props.className ?? "";

    const className = clsx({
        [spaceClassName]: props.children.isEntirelySpace(),
        [wordClassName]: !props.children.isEntirelySpace(),
        [customClassName]: props.className !== undefined,
    });

    return (
        <LyricTypography
            {...lyricTypographyProps}
            className={className}
            data-testid={props["data-testid"]}
        >
            {deserializeLyrics(props.children, false)}
        </LyricTypography>
    );
};

export default LyricDisplay;
