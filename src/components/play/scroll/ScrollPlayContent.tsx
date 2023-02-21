import { Box, styled } from "@mui/material";
import { ChordLine, TimestampedSection } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Collection } from "common/ChordModel/Collection";
import { noopFn, PlainFn } from "common/PlainFn";
import SectionHighlight from "components/display/SectionHighlight";
import { useNavigationKeys } from "components/play/common/useNavigateKeys";
import {
    ColourBorderContext,
    ColourBorderProvider,
} from "components/play/scroll/colourBorderContext";
import ScrollablePlayLine from "components/play/scroll/ScrollablePlayLine";
import { PlayerSectionContext } from "components/PlayerSectionContext";
import { List } from "immutable";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDebouncedCallback } from "use-debounce/lib";

const FullHeightBox = styled(Box)({
    height: "100vh",
});

interface InView {
    isInView: () => boolean;
    setIsInView: (fn: () => boolean) => void;
}

interface ViewportLine {
    id: string;
    type: "ViewportLine";
    chordLine: ChordLine;
    currentView: InView;
    previousView: InView;
    topPortion: InView;
    bottomPortion: InView;
    scrollInView: PlainFn;
    setScrollInView: (fn: PlainFn) => void;
}

interface ScrollPlayContentProps {
    song: ChordSong;
}

const ScrollPlayContentWithColourProvider: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    return (
        <ColourBorderProvider>
            <ScrollPlayContent song={props.song} />
        </ColourBorderProvider>
    );
};

const ScrollPlayContent: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    const lines = props.song.chordLines;

    const makeNoopInViewFn = (methodName: string): (() => boolean) => {
        return () => {
            console.error(`${methodName} method not initialized`);
            return false;
        };
    };

    const makeViewportLine = (chordLine: ChordLine): ViewportLine => {
        const viewportLine: ViewportLine = {
            id: chordLine.id,
            type: "ViewportLine",
            chordLine: chordLine,
            currentView: {
                setIsInView: noopFn,
                isInView: makeNoopInViewFn("currentView"),
            },
            previousView: {
                setIsInView: noopFn,
                isInView: makeNoopInViewFn("previousView"),
            },
            topPortion: {
                setIsInView: noopFn,
                isInView: makeNoopInViewFn("topView"),
            },
            bottomPortion: {
                setIsInView: noopFn,
                isInView: makeNoopInViewFn("bottomView"),
            },
            scrollInView: () =>
                console.error(
                    "scrollInView method not initialized",
                    chordLine.id
                ),
            setScrollInView: noopFn,
        };

        viewportLine.currentView.setIsInView = (inViewFn: () => boolean) => {
            viewportLine.currentView.isInView = inViewFn;
        };

        viewportLine.previousView.setIsInView = (inViewFn: () => boolean) => {
            viewportLine.previousView.isInView = inViewFn;
        };

        viewportLine.topPortion.setIsInView = (inViewFn: () => boolean) => {
            viewportLine.topPortion.isInView = inViewFn;
        };

        viewportLine.bottomPortion.setIsInView = (inViewFn: () => boolean) => {
            viewportLine.bottomPortion.isInView = inViewFn;
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

    const currentSectionItem = useContext(PlayerSectionContext);

    const { rotateBorderColour: rotateColour } =
        React.useContext(ColourBorderContext);

    const [nextScrollLine, setNextScrollLine] = useState<ViewportLine | null>(
        null
    );

    const [previousScrollLine, setPreviousScrollLine] =
        useState<ViewportLine | null>(null);

    useEffect(() => {
        if (currentSectionItem === null) {
            return;
        }

        const findSectionHead = (
            section: TimestampedSection
        ): ViewportLine | null => {
            for (let i = 0; i < lineRefs.current.length; i++) {
                const lineRef = lineRefs.current.getAtIndex(i);

                const isCurrentSectionHead = section.lineID === lineRef.id;
                if (isCurrentSectionHead) {
                    return lineRef;
                }
            }

            return null;
        };

        const sectionHeadLineRef = findSectionHead(
            currentSectionItem.timestampedSection
        );

        if (sectionHeadLineRef === null) {
            console.error("Could not find matching section in any line");
            return;
        }

        sectionHeadLineRef.scrollInView();
    }, [currentSectionItem]);

    const findNextScrollLine = useCallback((): ViewportLine | null => {
        let latestInViewLine: ViewportLine | null = null;

        for (let i = 0; i < lineRefs.current.length; i++) {
            const lineRef = lineRefs.current.getAtIndex(i);

            if (!lineRef.currentView.isInView()) {
                continue;
            }

            const currentViewLineRef = lineRef;
            if (
                currentViewLineRef.topPortion.isInView() ||
                currentViewLineRef.bottomPortion.isInView()
            ) {
                continue;
            }

            const centeredPortionLineRef = currentViewLineRef;
            if (centeredPortionLineRef.chordLine.isSectionHead()) {
                return centeredPortionLineRef;
            }

            latestInViewLine = centeredPortionLineRef;
        }

        return latestInViewLine;
    }, []);

    const findPreviousScrollLine = useCallback((): ViewportLine | null => {
        let latestInViewLine: ViewportLine | null = null;

        for (let i = lineRefs.current.length - 1; i >= 0; i--) {
            const lineRef = lineRefs.current.getAtIndex(i);

            if (!lineRef.previousView.isInView()) {
                continue;
            }

            const previousViewLineRef = lineRef;

            if (previousViewLineRef.chordLine.isSectionHead()) {
                return previousViewLineRef;
            }

            latestInViewLine = previousViewLineRef;
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

    const makePlayLine = useCallback(
        (chordLine: ChordLine): React.ReactElement => {
            const lineRef = lineRefs.current.get({
                id: chordLine.id,
                type: "ViewportLine",
            });

            const colourBorder =
                chordLine.id === nextScrollLine?.id ||
                chordLine.id === previousScrollLine?.id;

            return (
                <ScrollablePlayLine
                    key={chordLine.id}
                    chordLine={chordLine}
                    colourBorder={colourBorder}
                    inViewCallbacks={{
                        currentView: lineRef.currentView.setIsInView,
                        previousView: lineRef.previousView.setIsInView,
                        topPortion: lineRef.topPortion.setIsInView,
                        bottomPortion: lineRef.bottomPortion.setIsInView,
                    }}
                    scrollFnCallback={lineRef.setScrollInView}
                    inViewChanged={handleViewportChange}
                />
            );
        },
        [handleViewportChange, nextScrollLine, previousScrollLine]
    );

    const timeSectionedChordLines = useMemo(
        () => props.song.timeSectionedChordLines,
        [props.song]
    );

    const sections = useMemo(() => {
        return timeSectionedChordLines.map((sectionLines: List<ChordLine>) => (
            <SectionHighlight
                key={sectionLines.get(0)?.id}
                sectionLines={sectionLines}
                lineElementFn={makePlayLine}
            />
        ));
    }, [timeSectionedChordLines, makePlayLine]);

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
            {sections}
            <FullHeightBox />
        </Box>
    );
};

export default ScrollPlayContentWithColourProvider;
