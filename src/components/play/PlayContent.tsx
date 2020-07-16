import { Box, Paper, Theme, RootRef } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles, useTheme } from "@material-ui/styles";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useEffect, useState } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import PlayLine from "./PlayLine";

export interface PlayFormatting {
    numberOfColumns: number;
    fontSize: number;
    columnMargin: number;
}

interface PlayContentProps {
    song: ChordSong;
    formatting: PlayFormatting;
}

const PlayContent: React.FC<PlayContentProps> = (
    props: PlayContentProps
): JSX.Element => {
    const ref = React.useRef<HTMLElement>();

    const numberOfColumns =
        props.formatting.numberOfColumns >= 1
            ? props.formatting.numberOfColumns
            : 1;
    const columnMargin =
        props.formatting.columnMargin >= 0 ? props.formatting.columnMargin : 0;

    const windowWidth = useWindowWidth();
    const columnWidth = windowWidth / numberOfColumns;
    const snapThreshold = columnWidth / 2;

    const scrollPage = (forward: boolean) => {
        const currentPos = window.scrollX;
        const delta = forward ? windowWidth : -windowWidth;

        let nextPos = currentPos + delta;

        const distanceFromLastColumn = nextPos % columnWidth;

        if (distanceFromLastColumn < snapThreshold) {
            nextPos -= distanceFromLastColumn;
        } else {
            const remainingDistance = columnWidth - distanceFromLastColumn;
            nextPos += remainingDistance;
        }

        window.scrollTo({
            left: nextPos,
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollForward = () => scrollPage(true);
    const scrollBackward = () => scrollPage(false);

    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // only three keys ever go backwards, everything else goes forwards
        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp" ||
            event.key === "Backspace"
        ) {
            scrollBackward();
        } else {
            scrollForward();
        }

        event.preventDefault();
    };

    const handleClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const handlers: ((
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => boolean)[] = [handleLeftClick, handleRightClick];

        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };

    const handleLeftClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): boolean => {
        // left click
        if (event.button !== 0) {
            return false;
        }

        scrollForward();
        return true;
    };

    const handleRightClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): boolean => {
        // right click
        if (event.button !== 2) {
            return false;
        }

        scrollBackward();
        return true;
    };

    // sorry, preventing context menu from showing up to make the right mouse click
    // experience less annoying
    const cancelContextMenu = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
    };

    const ColumnedPaper = withStyles({
        root: {
            columnGap: "0px",
            columnRuleWidth: "2px",
            columnRuleStyle: "solid",
            columnRuleColor: grey[300],
            columns: numberOfColumns,
            height: "100vh",
            width: "100%",
        },
    })(Paper);

    // using margins instead of column-gap, CSS columns force the rightmost column
    // up against the edge of the viewport and doesn't strictly respect column width
    //
    // making 0 gap columns with margins makes the math a lot simpler for each column
    const MarginBox = withStyles({
        root: {
            marginLeft: `${columnMargin}px`,
            marginRight: `${columnMargin}px`,
        },
    })(Box);

    const lines = props.song.chordLines.map((chordLine: ChordLine) => {
        return <PlayLine line={chordLine} />;
    });

    useEffect(() => {
        ref.current?.focus();
    });

    return (
        <RootRef rootRef={ref}>
            <ColumnedPaper
                onMouseDown={handleClick}
                onContextMenu={cancelContextMenu}
                tabIndex={0}
                onKeyDown={handleKey}
            >
                <MarginBox>{lines}</MarginBox>
            </ColumnedPaper>
        </RootRef>
    );
};

export default PlayContent;
