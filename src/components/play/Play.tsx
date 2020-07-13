import { Box, Paper } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useEffect } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import PlayMenu from "./PlayMenu";
import PlayLine from "./PlayLine";

interface PlayProps {
    song: ChordSong;
    onEdit?: () => void;
}

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const numberOfColumns = 2;
    const columnMargin = 20;

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

    const handleKey = (event: KeyboardEvent) => {
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
        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);
    });

    return (
        <ColumnedPaper
            onMouseDown={handleClick}
            onContextMenu={cancelContextMenu}
        >
            <PlayMenu onExit={props.onEdit} />
            <MarginBox>{lines}</MarginBox>
        </ColumnedPaper>
    );
};

export default Play;
