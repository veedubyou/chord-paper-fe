import { Box, StyledComponentProps, withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import Lyric, { LyricTypography, lyricTypographyProps } from "../display/Lyric";
import {
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName,
} from "./HighlightChordLyricStyle";

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

interface ChordTargetBoxProps extends StyledComponentProps {
    children: string;
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
            classes={props.classes}
            className={props.className}
            data-testid="ChordEditButton"
        >
            {props.children}
        </InvisibleTypography>
    );
};

interface TokenProps {
    children: string;
    index: number;
    className?: string;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const Token: React.FC<TokenProps> = (props: TokenProps): JSX.Element => {
    const invisibleTarget = (): JSX.Element | null => {
        if (props.invisibleTarget === undefined) {
            return null;
        }

        return (
            <ChordTargetBox
                className={clsx(chordTargetClassName, chordSymbolClassName)}
                onClick={props.invisibleTarget.onClick}
            >
                {props.children}
            </ChordTargetBox>
        );
    };

    const lyricClassName: string | undefined =
        props.index === 0 ? firstTokenClassName : undefined;

    const lyricBlock = (
        <Lyric className={lyricClassName} data-testid={`Token-${props.index}`}>
            {props.children}
        </Lyric>
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
