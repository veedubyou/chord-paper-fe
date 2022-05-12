import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { List } from "immutable";
import React, { useCallback, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce/lib";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { Collection } from "../../../common/ChordModel/Collection";
import { PlainFn } from "../../../common/PlainFn";
import FocusedElement from "../common/FocusedElement";
import { useNavigationKeys } from "../common/useNavigateKeys";
import ScrollablePlayLine from "./ScrollablePlayLine";

const FullHeightBox = withStyles({
    root: {
        height: "100vh",
    },
})(Box);

interface ViewportLine {
    id: string;
    type: "ViewportLine";
    chordLine: ChordLine;
    isInCurrentView: () => boolean;
    isInPreviousView: () => boolean;
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
        isInPreviousView: () => {
            console.error(
                "isInPreviousView method not initialized",
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
    });

    const makePlayLine = (chordLine: ChordLine): React.ReactElement => {
        const lineRef = lineRefs.current.get({
            id: chordLine.id,
            type: "ViewportLine",
        });

        const setInCurrentViewFn = (inViewFn: () => boolean) => {
            lineRef.isInCurrentView = inViewFn;
        };

        const setInPreviousViewFn = (inViewFn: () => boolean) => {
            lineRef.isInPreviousView = inViewFn;
        };

        const setScrollFn = (scrollFn: PlainFn) => {
            lineRef.scrollInView = scrollFn;
        };

        const highlight =
            chordLine.id === nextScrollLine?.id ||
            chordLine.id === previousScrollLine?.id;

        return (
            <ScrollablePlayLine
                key={chordLine.id}
                chordLine={chordLine}
                highlight={highlight}
                isInCurrentViewFnCallback={setInCurrentViewFn}
                isInPreviousViewFnCallback={setInPreviousViewFn}
                scrollFnCallback={setScrollFn}
                inViewChanged={handleViewportChange}
            />
        );
    };

    const playLines = lines.list.map(makePlayLine);

    const scrollDown = (): boolean => {
        if (nextScrollLine === null) {
            return false;
        }

        nextScrollLine.scrollInView();
        return true;
    };

    const scrollUp = (): boolean => {
        if (previousScrollLine === null) {
            return false;
        }

        previousScrollLine.scrollInView();
        return true;
    };

    useNavigationKeys(scrollDown, scrollUp);

    return (
        <FocusedElement>
            <Box>
                {playLines}
                <FullHeightBox />
            </Box>
        </FocusedElement>
    );
};

export default ScrollPlayContent;
