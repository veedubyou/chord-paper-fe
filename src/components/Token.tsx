import { Box, RootRef, Theme } from "@material-ui/core";
import React, { useState } from "react";
import LyricToken, { ChordTargetBox, ChordTargetBoxProps } from "./LyricToken";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { DNDChordType, DNDChord } from "./DNDChord";
import { withStyles } from "@material-ui/styles";
import {
    withChordLyricStyle,
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName,
    withHighlightedChordLyricStyle,
} from "./HighlightChordLyricStyle";
import clsx from "clsx";

interface TokenProps {
    children: string;
    index: number;
    onDropped?: (newChord: string) => void;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const Token: React.FC<TokenProps> = (props: TokenProps): JSX.Element => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DNDChord, any>({
        accept: DNDChordType,
        drop: (droppedItem: DNDChord) => {
            if (!droppedItem.handled && props.onDropped) {
                props.onDropped(droppedItem.chord);
            }
            return droppedItem;
        },
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
        }),
    });

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

    //TODO
    const className: string | undefined =
        props.index === 0 ? firstTokenClassName : undefined;

    const lyricBlock = (
        <LyricToken className={className} data-testid={`Token-${props.index}`}>
            {props.children}
        </LyricToken>
    );

    const NewBox = isOver
        ? withHighlightedChordLyricStyle()(Box)
        : withChordLyricStyle()(Box);

    //TODO
    return (
        <RootRef rootRef={dropRef}>
            <NewBox
                key={props.index}
                position="relative"
                display="inline"
                data-testid={`TokenBox-${props.index}`}
            >
                {invisibleTarget()}
                {lyricBlock}
            </NewBox>
        </RootRef>
    );
};

export default Token;
