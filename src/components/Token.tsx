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
import { IDable } from "../common/ChordModel/Collection";

interface TokenProps {
    children: string;
    index: number;
    onDropped?: (newChord: string, sourceBlockID: IDable<"ChordBlock">) => void;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const HighlightedBox = withHighlightedChordLyricStyle()(Box);
const HoverHighlightBox = withChordLyricStyle()(Box);

const Token: React.FC<TokenProps> = (props: TokenProps): JSX.Element => {
    // console.log("token render");
    const [{ isOver }, dropRef] = useDrop<DNDChord, DNDChord, any>({
        accept: DNDChordType,
        drop: (droppedChord: DNDChord) => {
            console.log("dropped");
            if (!droppedChord.handled && props.onDropped) {
                droppedChord.handled = true;
                props.onDropped(droppedChord.chord, droppedChord.sourceBlockID);
            }
            return droppedChord;
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

    const StyledBox = isOver ? HighlightedBox : HoverHighlightBox;

    //TODO
    return (
        <RootRef rootRef={dropRef}>
            <StyledBox
                key={props.index}
                position="relative"
                display="inline"
                data-testid={`TokenBox-${props.index}`}
            >
                {invisibleTarget()}
                {lyricBlock}
            </StyledBox>
        </RootRef>
    );
};

export default Token;
