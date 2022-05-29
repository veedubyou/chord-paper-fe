import { Box, Paper, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useWindowWidth } from "@react-hook/window-size";
import React, { useEffect, useState } from "react";
import useScrollbarSize from "react-scrollbar-size";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import PlayLine from "../common/PlayLine";
import { useNavigationKeys } from "../common/useNavigateKeys";

export interface PageDisplaySettings {
    numberOfColumnsPerPage: number;
    fontSize: number;
    columnMargin: number;
    flipType: "page" | "column";
}

interface PagePlayContentProps {
    song: ChordSong;
    displaySettings: PageDisplaySettings;
}

const PagePlayContent: React.FC<PagePlayContentProps> = (
    props: PagePlayContentProps
): JSX.Element => {
    const [numberOfEmptyColumns, setNumberOfEmptyColumns] = useState<number>(0);

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
    const { height: scrollbarHeight } = useScrollbarSize();

    const flipPage = (direction: "forward" | "backward"): boolean => {
        const currentPos = window.scrollX;
        const delta: number = (() => {
            const scrollDelta =
                props.displaySettings.flipType === "column"
                    ? columnWidth
                    : windowWidth;

            if (direction === "backward") {
                return -scrollDelta;
            }
            return scrollDelta;
        })();

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

        return true;
    };

    const flipForward = () => flipPage("forward");
    const flipBackward = () => flipPage("backward");

    useNavigationKeys(flipForward, flipBackward);

    const viewportHeightWithoutScrollbar = `calc(100vh - ${scrollbarHeight}px)`;

    const ColumnedPaper = styled(Paper)({
        columnGap: "0px",
        columnRuleWidth: "2px",
        columnRuleStyle: "solid",
        columnRuleColor: grey[300],
        columns: numberOfColumnsPerPage,
        height: viewportHeightWithoutScrollbar,
        width: "100%",
    });

    // using margins instead of column-gap, CSS columns force the rightmost column
    // up against the edge of the viewport and doesn't strictly respect column width
    //
    // making 0 gap columns with margins makes the math a lot simpler for each column
    const MarginBox = styled(Box)({
        marginLeft: `${columnMargin}px`,
        marginRight: `${columnMargin}px`,
    });

    const lines = props.song.chordLines.list.map((chordLine: ChordLine) => {
        return <PlayLine chordLine={chordLine} key={chordLine.id} />;
    });

    const FullHeightBox = styled(Box)({
        height: viewportHeightWithoutScrollbar,
        pageBreakInside: "avoid",
    });

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
        // add some empty columns to the end of the song
        // so that each "page flip" navigation ends evenly
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
        <ColumnedPaper>
            <MarginBox>{lines}</MarginBox>
            {emptyColumns}
        </ColumnedPaper>
    );
};

export default PagePlayContent;
