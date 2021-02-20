import { Box, Paper, RootRef } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useEffect, useState } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import PlayLine from "./PlayLine";

export interface DisplaySettings {
    numberOfColumns: number;
    fontSize: number;
    columnMargin: number;
}

interface PlayContentProps {
    song: ChordSong;
    displaySettings: DisplaySettings;
    height: string;
}

class EventBatcher {
    timeWindow: number;
    callbackFn: () => void;
    private processingEvent: boolean;

    constructor(timeWindow: number, callbackFn: () => void) {
        this.timeWindow = timeWindow;
        this.callbackFn = callbackFn;
        this.processingEvent = false;
    }

    processEvent() {
        console.log("called process event");

        if (!this.processingEvent) {
            setTimeout(this.executeCallback, this.timeWindow);
        }

        this.processingEvent = true;
    }

    private executeCallback() {
        this.callbackFn();
        this.processingEvent = false;
    }
}

const PlayContent: React.FC<PlayContentProps> = (
    props: PlayContentProps
): JSX.Element => {
    const ref = React.useRef<HTMLElement>();
    const [numberOfColumnPaddings, setNumberOfColumnPaddings] = useState<
        number | null
    >(null);

    const numberOfColumns =
        props.displaySettings.numberOfColumns >= 1
            ? props.displaySettings.numberOfColumns
            : 1;
    const columnMargin =
        props.displaySettings.columnMargin >= 0
            ? props.displaySettings.columnMargin
            : 0;

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

        // returning false not prevent default
        // preventing default would prevent clicking back into the main body to get focus
        return false;
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
            height: props.height,
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
        return <PlayLine chordLine={chordLine} key={chordLine.id} />;
    });

    const FullHeightBox = withStyles({
        root: {
            height: props.height,
        },
    })(Box);

    const columnPadding: React.ReactElement[] = (() => {
        const numberOfDivs =
            numberOfColumnPaddings !== null ? numberOfColumnPaddings : 0;

        const divPads: React.ReactElement[] = [];

        for (let i = 0; i < numberOfDivs; i++) {
            divPads.push(
                <FullHeightBox key={`empty-column-${i}`}>
                    <div></div>
                </FullHeightBox>
            );
        }

        return divPads;
    })();

    const clearColumnPadding = () => {
        console.log("resize event");
        setNumberOfColumnPaddings(null);
    };

    useEffect(() => {
        ref.current?.focus();

        const batcher = new EventBatcher(2000, clearColumnPadding);

        window.addEventListener("resize", batcher.processEvent);

        return () => window.removeEventListener("resize", batcher.processEvent);
    });

    useEffect(() => {
        const numberOfFilledColumns = Math.round(
            (numberOfColumns * document.body.scrollWidth) / window.innerWidth
        );

        const remainderOfColumns: number =
            numberOfFilledColumns % numberOfColumns;

        if (numberOfColumnPaddings === null) {
            setNumberOfColumnPaddings(remainderOfColumns);
        }

        console.log("effect", numberOfColumnPaddings, remainderOfColumns);

        if (remainderOfColumns !== numberOfColumnPaddings) {
        }
    }, [numberOfColumns, numberOfColumnPaddings, setNumberOfColumnPaddings]);

    return (
        <RootRef rootRef={ref}>
            <ColumnedPaper
                onMouseDown={handleClick}
                onContextMenu={cancelContextMenu}
                tabIndex={0}
                onKeyDown={handleKey}
            >
                <MarginBox>{lines}</MarginBox>
                {columnPadding}
            </ColumnedPaper>
        </RootRef>
    );
};

export default PlayContent;
