import { Box, RootRef, Theme } from "@material-ui/core";
import React, { useState } from "react";
import LyricToken, { ChordTargetBox, ChordTargetBoxProps } from "./LyricToken";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { DNDChordType } from "./DNDChord";
import { withStyles } from "@material-ui/styles";
import {
    withChordLyricStyle,
    chordSymbolClassName,
    chordTargetClassName,
    firstTokenClassName,
} from "./HighlightChordLyricStyle";
import clsx from "clsx";

interface TokenProps {
    children: string;
    index: number;
    invisibleTarget?: { onClick: ChordTargetBoxProps["onClick"] };
}

const Token: React.FC<TokenProps> = (props: TokenProps): JSX.Element => {
    const [draggedOver, setDraggedOver] = useState(false);

    const [{ isOver, canDrop, item }, dropRef] = useDrop({
        accept: DNDChordType,
        drop: () => console.log("dropped"),
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });

    const invisibleTarget = (): JSX.Element | null => {
        if (props.invisibleTarget === undefined) {
            return null;
        }

        if (draggedOver) {
            return <ChordTargetBox>{props.children}</ChordTargetBox>;
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

    console.log(item !== null ? item.chord : null);

    //TODO
    const className: string | undefined =
        props.index === 0 ? firstTokenClassName : undefined;

    const lyricBlock = (
        <LyricToken className={className} data-testid={`Token-${props.index}`}>
            {props.children}
        </LyricToken>
    );

    const NewBox = withChordLyricStyle()(Box);

    //TODO
    return (
        <RootRef rootRef={dropRef}>
            <NewBox
                key={props.index}
                position="relative"
                display="inline"
                onDragEnter={() => setDraggedOver(true)}
                onDragExit={() => setDraggedOver(false)}
                data-testid={`TokenBox-${props.index}`}
            >
                {invisibleTarget()}
                {lyricBlock}
            </NewBox>
        </RootRef>
    );
};

export default Token;
