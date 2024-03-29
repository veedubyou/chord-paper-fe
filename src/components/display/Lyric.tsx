import { cx } from "@emotion/css";
import { styled, Typography, TypographyProps } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { Lyric } from "common/ChordModel/Lyric";
import { DataTestID } from "common/DataTestID";
import { spaceClassName, wordClassName } from "components/edit/HighlightableBlockStyle";
import { deserializeLyrics } from "components/lyrics/Serialization";
import React from "react";

export const lyricTypographyVariant: "h6" = "h6";

export const lyricTypographyProps = {
    variant: lyricTypographyVariant,
    display: "inline" as "inline",
};

export const lyricStyle: CSSProperties = {
    whiteSpace: "pre",
    wordSpacing: ".15em",
    display: "inline-block",
};

export const LyricTypography = styled(Typography)<TypographyProps>({
    ...lyricStyle,
});

interface LyricTypographyProps extends DataTestID {
    children: Lyric;
    className?: string;
}

const LyricDisplay: React.FC<LyricTypographyProps> = (
    props: LyricTypographyProps
): JSX.Element => {
    const customClassName = props.className ?? "";

    const className = cx({
        [spaceClassName]: props.children.isEntirelySpaceOrTab(),
        [wordClassName]: !props.children.isEntirelySpaceOrTab(),
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
