import { cx } from "@emotion/css";
import { Box, styled } from "@mui/material";
import { Lyric } from "common/ChordModel/Lyric";
import LyricDisplay, {
    LyricTypography,
    lyricTypographyProps
} from "components/display/Lyric";
import {
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName
} from "components/edit/HighlightableBlockStyle";
import { deserializeLyrics } from "components/lyrics/Serialization";
import React from "react";

const commonTypography = {
    cursor: "pointer",
    userSelect: "none",
    position: "absolute",
    left: 0,
    top: 0,
    transform: "translate(0%, -110%)",
} as const;

const VisibleTypography = styled(LyricTypography)(commonTypography);

const InvisibleTypography = styled(LyricTypography)({
    ...commonTypography,
    color: "transparent",
});

interface ChordTargetBoxProps {
    children: React.ReactNode;
    invisible: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

const ChordTargetBox: React.FC<ChordTargetBoxProps> = (
    props: ChordTargetBoxProps
): JSX.Element => {
    const Typography = props.invisible ? InvisibleTypography : VisibleTypography;

    return (
        <Typography
            {...lyricTypographyProps}
            onClick={props.onClick}
            className={props.className}
            data-testid="ChordEditButton"
        >
            {props.children}
        </Typography>
    );
};

interface TokenProps {
    children: Lyric;
    index: number;
    className?: string;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const Token = React.forwardRef(
    (props: TokenProps, ref: React.ForwardedRef<Element>): JSX.Element => {
        const invisibleTarget = (): JSX.Element | null => {
            if (props.invisibleTarget === undefined) {
                return null;
            }

            const content: React.ReactNode[] = deserializeLyrics(
                props.children,
                false
            );

            const isSeparator = content.length === 1 && content[0] === '|';

            return (
                <ChordTargetBox
                    className={cx(chordTargetClassName, chordSymbolClassName)}
                    onClick={props.invisibleTarget.onClick}
                    invisible={!isSeparator}
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
                ref={ref}
            >
                {invisibleTarget()}
                {lyricBlock}
            </Box>
        );
    }
);

export default Token;
