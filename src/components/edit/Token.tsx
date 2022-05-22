import { Box } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import clsx from "clsx";
import React from "react";
import LyricDisplay, {
    LyricTypography,
    lyricTypographyProps,
} from "../display/Lyric";
import {
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName,
} from "./HighlightChordLyricStyle";
import { Lyric } from "../../common/ChordModel/Lyric";
import { deserializeLyrics } from "../lyrics/Serialization";

const InvisibleTypography = withStyles({
    root: {
        color: "transparent",
        cursor: "pointer",
        userSelect: "none",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(0%, -110%)",
    },
})(LyricTypography);

interface ChordTargetBoxProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const ChordTargetBox: React.FC<ChordTargetBoxProps> = (
    props: ChordTargetBoxProps
): JSX.Element => {
    return (
        <InvisibleTypography
            {...lyricTypographyProps}
            onClick={props.onClick}
            className={props.className}
            data-testid="ChordEditButton"
        >
            {props.children}
        </InvisibleTypography>
    );
};

interface TokenProps {
    children: Lyric;
    index: number;
    className?: string;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const Token: React.FC<TokenProps> = (props: TokenProps): JSX.Element => {
    const invisibleTarget = (): JSX.Element | null => {
        if (props.invisibleTarget === undefined) {
            return null;
        }

        const content: React.ReactNode[] = deserializeLyrics(
            props.children,
            false
        );

        return (
            <ChordTargetBox
                className={clsx(chordTargetClassName, chordSymbolClassName)}
                onClick={props.invisibleTarget.onClick}
            >
                {content}
            </ChordTargetBox>
        );
    };

    const lyricClassName: string | undefined =
        props.index === 0 ? firstTokenClassName : undefined;

    const lyricBlock = (
        <LyricDisplay
            className={lyricClassName}
            data-testid={`Token-${props.index}`}
        >
            {props.children}
        </LyricDisplay>
    );

    return (
        <Box
            className={props.className}
            key={props.index}
            position="relative"
            display="inline"
            data-testid={`TokenBox-${props.index}`}
        >
            {invisibleTarget()}
            {lyricBlock}
        </Box>
    );
};

export default Token;
