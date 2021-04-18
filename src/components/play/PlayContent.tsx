import { Box, Paper, RootRef } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useEffect, useState } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { useRegisterKeyListener } from "../GlobalKeyListener";
import { isScrollBackwardsKey, isScrollForwardsKey } from "./keyMap";
import PlayLine from "./PlayLine";

export interface DisplaySettings {
    numberOfColumnsPerPage: number;
    fontSize: number;
    columnMargin: number;
}

interface PlayContentProps {
    song: ChordSong;
    displaySettings: DisplaySettings;
}

const PlayContent: React.FC<PlayContentProps> = (
    props: PlayContentProps
): JSX.Element => {
    const ref = React.useRef<HTMLElement>();
    const [numberOfEmptyColumns, setNumberOfEmptyColumns] = useState<number>(0);
    const [addKeyListener, removeKeyListener] = useRegisterKeyListener();

    const numberOfColumnsPerPage =
        props.displaySettings.numberOfColumnsPerPage >= 1
            ? props.displaySettings.numberOfColumnsPerPage
            : 1;
    const columnMargin =
        props.displaySettings.columnMargin >= 0
            ? props.displaySettings.columnMargin
            : 0;

    const windowWidth = useWindowWidth();
    const columnWidth = windowWidth / numberOfColumnsPerPage;
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
            columns: numberOfColumnsPerPage,
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
        return <PlayLine chordLine={chordLine} key={chordLine.id} />;
    });

    const FullHeightBox = withStyles({
        root: {
            height: "100vh",
            pageBreakInside: "avoid",
        },
    })(Box);

    const emptyColumns: React.ReactElement[] = (() => {
        if (numberOfEmptyColumns === null) {
            return [];
        }

        const cols: React.ReactElement[] = [];

        for (let i = 0; i < numberOfEmptyColumns; i++) {
            cols.push(
                <FullHeightBox key={`empty-column-${i}`}>
                    <div />
                </FullHeightBox>
            );
        }

        return cols;
    })();

    useEffect(() => {
        ref.current?.focus();
    });

    useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (isScrollBackwardsKey(event.code)) {
                scrollBackward();
                event.preventDefault();
                return;
            }

            if (isScrollForwardsKey(event.code)) {
                scrollForward();
                event.preventDefault();
                return;
            }
        };

        addKeyListener(handleKey);

        return () => removeKeyListener(handleKey);
    });

    useEffect(() => {
        // add some empty columns to the end of the song
        // so that each "page scroll" navigation ends evenly
        // e.g. if a 3 column page is divided as 5 columns: a | b | c | d | e
        // then the user will see
        // page 1: a | b | c
        // page 2: c | d | e
        // this will add a div to the end so that it will look like
        // page 1: a | b | c
        // page 2: d | e | [empty]

        const numberOfRenderedColumns = Math.round(
            document.body.scrollWidth / columnWidth
        );

        const numberOfColumnsInLastPage: number =
            numberOfRenderedColumns % numberOfColumnsPerPage;

        if (numberOfColumnsInLastPage !== 0) {
            let nextNumberOfEmptyColumns =
                numberOfColumnsPerPage -
                numberOfColumnsInLastPage +
                numberOfEmptyColumns;

            nextNumberOfEmptyColumns =
                nextNumberOfEmptyColumns % numberOfColumnsPerPage;

            setNumberOfEmptyColumns(nextNumberOfEmptyColumns);
        }
    }, [
        numberOfColumnsPerPage,
        columnWidth,
        numberOfEmptyColumns,
        setNumberOfEmptyColumns,
        props,
    ]);

    return (
        <RootRef rootRef={ref}>
            <ColumnedPaper
                onMouseDown={handleClick}
                onContextMenu={cancelContextMenu}
                tabIndex={0}
            >
                <MarginBox>{lines}</MarginBox>
                {emptyColumns}
            </ColumnedPaper>
        </RootRef>
    );
};

export default PlayContent;
