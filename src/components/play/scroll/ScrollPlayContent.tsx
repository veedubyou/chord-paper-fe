import { Box, styled } from "@mui/material";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Collection } from "common/ChordModel/Collection";
import { noopFn, PlainFn } from "common/PlainFn";
import { useNavigationKeys } from "components/play/common/useNavigateKeys";
import {
    HighlightBorderContext,
    HighlightBorderProvider
} from "components/play/scroll/highlightBorderContext";
import ScrollablePlayLine from "components/play/scroll/ScrollablePlayLine";
import { List } from "immutable";
import React, { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";

const FullHeightBox = styled(Box)({
    height: "100vh",
});

interface ViewportLine {
    id: string;
    type: "ViewportLine";
    chordLine: ChordLine;
    isInCurrentView: () => boolean;
    setIsInCurrentView: (fn: () => boolean) => void;
    isInPreviousView: () => boolean;
    setIsInPreviousView: (fn: () => boolean) => void;
    scrollInView: PlainFn;
    setScrollInView: (fn: PlainFn) => void;
}

interface ScrollPlayContentProps {
    song: ChordSong;
}

const ScrollPlayContentWithHighlightProvider: React.FC<ScrollPlayContentProps> =
    (props: ScrollPlayContentProps): JSX.Element => {
        return (
            <HighlightBorderProvider>
                <ScrollPlayContent song={props.song} />
            </HighlightBorderProvider>
        );
    };

const ScrollPlayContent: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    const lines = props.song.chordLines;

    const makeViewportLine = (chordLine: ChordLine): ViewportLine => {
        const viewportLine: ViewportLine = {
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
            isInPreviousView: () => {
                console.error(
                    "isInPreviousView method not initialized",
                    chordLine.id
                );
                return false;
            },
            scrollInView: () =>
                console.error(
                    "scrollInView method not initialized",
                    chordLine.id
                ),
            setIsInCurrentView: noopFn,
            setIsInPreviousView: noopFn,
            setScrollInView: noopFn,
        };

        viewportLine.setIsInCurrentView = (inViewFn: () => boolean) => {
            viewportLine.isInCurrentView = inViewFn;
        };

        viewportLine.setIsInPreviousView = (inViewFn: () => boolean) => {
            viewportLine.isInPreviousView = inViewFn;
        };

        viewportLine.setScrollInView = (scrollFn: PlainFn) => {
            viewportLine.scrollInView = scrollFn;
        };

        return viewportLine;
    };

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

    const { rotateBorderColour: rotateColour } = React.useContext(
        HighlightBorderContext
    );

    const [previousScrollLine, setPreviousScrollLine] =
        useState<ViewportLine | null>(null);

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

    const findPreviousScrollLine = useCallback((): ViewportLine | null => {
        let latestInViewLine: ViewportLine | null = null;

        for (let i = lineRefs.current.length - 1; i >= 0; i--) {
            const lineRef = lineRefs.current.getAtIndex(i);

            if (!lineRef.isInPreviousView()) {
                continue;
            }

            if (lineRef.chordLine.hasSection()) {
                return lineRef;
            }

            latestInViewLine = lineRef;
        }

        return latestInViewLine;
    }, []);

    const setCachedSections = useCallback(() => {
        const maybeNextScrollLine = findNextScrollLine();
        if (maybeNextScrollLine !== nextScrollLine) {
            setNextScrollLine(maybeNextScrollLine);
        }

        const maybePreviousScrollLine = findPreviousScrollLine();
        if (maybePreviousScrollLine !== previousScrollLine) {
            setPreviousScrollLine(maybePreviousScrollLine);
        }
    }, [
        findNextScrollLine,
        findPreviousScrollLine,
        nextScrollLine,
        setNextScrollLine,
        previousScrollLine,
        setPreviousScrollLine,
    ]);

    const handleViewportChange = useDebouncedCallback(setCachedSections, 300, {
        leading: false,
        trailing: true,
        maxWait: 300,
    });

    const makePlayLine = (chordLine: ChordLine): React.ReactElement => {
        const lineRef = lineRefs.current.get({
            id: chordLine.id,
            type: "ViewportLine",
        });

        const highlight =
            chordLine.id === nextScrollLine?.id ||
            chordLine.id === previousScrollLine?.id;

        return (
            <ScrollablePlayLine
                key={chordLine.id}
                chordLine={chordLine}
                highlight={highlight}
                isInCurrentViewFnCallback={lineRef.setIsInCurrentView}
                isInPreviousViewFnCallback={lineRef.setIsInPreviousView}
                scrollFnCallback={lineRef.setScrollInView}
                inViewChanged={handleViewportChange}
            />
        );
    };

    const playLines = lines.list.map(makePlayLine);

    const scrollDown = (): boolean => {
        if (nextScrollLine === null) {
            return false;
        }

        rotateColour();
        nextScrollLine.scrollInView();
        return true;
    };

    const scrollUp = (): boolean => {
        if (previousScrollLine === null) {
            return false;
        }

        rotateColour();
        previousScrollLine.scrollInView();
        return true;
    };

    useNavigationKeys(scrollDown, scrollUp);

    return (
        <Box>
            {playLines}
            <FullHeightBox />
        </Box>
    );
};

export default ScrollPlayContentWithHighlightProvider;
