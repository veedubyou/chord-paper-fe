import { Box } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName,
} from "./HighlightChordLyricStyle";
import Lyric from "../display/Lyric";
import ChordTargetBox, { ChordTargetBoxProps } from "./ChordTargetBox";

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
