import { Box } from "@material-ui/core";
import { List } from "immutable";
import React, { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { Collection } from "../../../common/ChordModel/Collection";
import { PlainFn } from "../../../common/PlainFn";
import FocusedElement from "../common/FocusedElement";
import PlayLine from "../common/PlayLine";
import { useNavigationKeys } from "../common/useNavigateKeys";
import HighlightBorderBox from "./HighlightBorderBox";
import InViewElement from "./InViewElement";
import ScrollingElement from "./ScrollingElement";

// these values determine the portion of the viewport that is used to consider
// the next line that the user can scroll to
// e.g. top: -15, bottom: -25 is equivalent to the area 15% vh to 75% vh from the top

// the top margin prevents scrolls that end up only scrolling 1-2 lines because
// the upcoming section is very near the top
const topViewportMarginPercent = -15;
// the bottom margin prevents a super big jump, so the user has some lookahead
// and isn't scrolled to an entirely new section without continuity
const bottomViewportMarginPercent = -25;

interface ViewportLine {
    id: string;
    type: "ViewportLine";
    chordLine: ChordLine;
    isInCurrentView: () => boolean;
    scrollInView: PlainFn;
}

interface ScrollPlayContentProps {
    song: ChordSong;
}

const ScrollPlayContent: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    const lines = props.song.chordLines;

    const makeViewportLine = (chordLine: ChordLine): ViewportLine => ({
        id: chordLine.id,
        type: "ViewportLine",
        chordLine: chordLine,
        isInCurrentView: () => {
            console.error(
                "isInCurrentView method not initialized",
                chordLine.id
            );
            return false;
        },
        scrollInView: () =>
            console.error("scrollInView method not initialized", chordLine.id),
    });

    const makeViewportLines = (
        chordLines: List<ChordLine>
    ): Collection<ViewportLine> => {
        const viewportLines: List<ViewportLine> =
            chordLines.map(makeViewportLine);
        return new Collection(viewportLines);
    };

    const lineRefs = useRef<Collection<ViewportLine>>(
        makeViewportLines(lines.list)
    );

    const [nextScrollLine, setNextScrollLine] = useState<ViewportLine | null>(
        null
    );

    const findNextScrollLine = useCallback((): ViewportLine | null => {
        let latestInViewLine: ViewportLine | null = null;

        for (let i = 0; i < lineRefs.current.length; i++) {
            const lineRef = lineRefs.current.getAtIndex(i);

            if (!lineRef.isInCurrentView()) {
                continue;
            }

            if (lineRef.chordLine.hasSection()) {
                return lineRef;
            }

            latestInViewLine = lineRef;
        }

        return latestInViewLine;
    }, []);

    const setNextSection = useCallback(() => {
        const maybeNextScrollLine = findNextScrollLine();
        if (maybeNextScrollLine !== nextScrollLine) {
            setNextScrollLine(maybeNextScrollLine);
        }
    }, [findNextScrollLine, nextScrollLine, setNextScrollLine]);

    const handleViewportChange = useDebouncedCallback(setNextSection, 300, {
        leading: false,
        trailing: true,
    });

    const makePlayLine = (chordLine: ChordLine): React.ReactElement => {
        const lineRef = lineRefs.current.get({
            id: chordLine.id,
            type: "ViewportLine",
        });

        const setInViewFn = (inViewFn: () => boolean) => {
            lineRef.isInCurrentView = inViewFn;
        };

        const setScrollFn = (scrollFn: PlainFn) => {
            lineRef.scrollInView = scrollFn;
        };

        const highlight = chordLine.id === nextScrollLine?.id;

        return (
            <InViewElement
                key={chordLine.id}
                topMarginPercentage={topViewportMarginPercent}
                bottomMarginPercentage={bottomViewportMarginPercent}
                isInViewFnCallback={setInViewFn}
                inViewChanged={handleViewportChange}
            >
                <ScrollingElement scrollFnCallback={setScrollFn}>
                    <HighlightBorderBox highlight={highlight}>
                        <PlayLine key={chordLine.id} chordLine={chordLine} />
                    </HighlightBorderBox>
                </ScrollingElement>
            </InViewElement>
        );
    };

    const playLines = lines.list.map(makePlayLine);

    const scrollDown = () => {
        if (nextScrollLine === null) {
            return false;
        }

        nextScrollLine.scrollInView();
        return true;
    };

    useNavigationKeys(scrollDown, () => false);

    return (
        <FocusedElement>
            <Box>{playLines}</Box>
        </FocusedElement>
    );
};

export default ScrollPlayContent;
