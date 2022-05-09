import { Box, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { noopFn } from "../../../common/PlainFn";
import { inflatingWhitespace } from "../../../common/Whitespace";
import FocusedElement from "../common/FocusedElement";
import PlayLine from "../common/PlayLine";
import { useNavigationKeys } from "../common/useNavigateKeys";
import IntersectingElement, { ViewportElement } from "./IntersectingElement";
import PlaySection, {
    ScrollableElement,
    sectionChordLines,
    SectionedChordLines,
    Visibility,
} from "./PlaySection";

interface ScrollPlayContentProps {
    song: ChordSong;
}

const ScrollPlayContent: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    const lines = props.song.chordLines;

    const createEmptyRefs = (linesLength: number): ViewportElement[] => {
        const newRefs: ViewportElement[] = [];

        for (let i = 0; i < linesLength; i++) {
            newRefs.push({
                isInView: () => false,
                scrollIntoView: noopFn,
            });
        }

        return newRefs;
    };

    const lineRefs = useRef<ViewportElement[]>(createEmptyRefs(lines.length));
    const [nextScrollToLineID, setNextScrollToLineID] = useState<string | null>(
        null
    );

    const findNextScrollLineID = useCallback((): string | null => {
        let encounteredFirstLineInView = false;
        let latestInViewLineID: string | null = null;
        for (let i = 0; i < lineRefs.current.length; i++) {
            const lineRef = lineRefs.current[i];

            if (!lineRef.isInView()) {
                continue;
            }

            if (!encounteredFirstLineInView) {
                encounteredFirstLineInView = true;
                continue;
            }

            const chordLine = lines.getAtIndex(i);
            if (chordLine.hasSection()) {
                return chordLine.id;
            }

            latestInViewLineID = chordLine.id;
        }

        return latestInViewLineID;
    }, [lines]);

    useEffect(() => {
        const setAThing = () => {
            const nextID = findNextScrollLineID();
            console.log("next id", nextID);
            if (nextID !== nextScrollToLineID) {
                setNextScrollToLineID(nextID);
            }
        };

        const intervalID = setInterval(setAThing, 5000);

        return () => clearInterval(intervalID);
    }, [nextScrollToLineID, setNextScrollToLineID, findNextScrollLineID, lines]);

    const makePlayLine = (
        chordLine: ChordLine,
        index: number
    ): React.ReactElement => {
        const refCallback = (viewportElement: ViewportElement) => {
            lineRefs.current[index] = viewportElement;
        };

        const highlight = chordLine.id === nextScrollToLineID;

        return (
            <IntersectingElement
                key={chordLine.id}
                highlight={highlight}
                viewportElementRefCallback={refCallback}
                inViewChanged={noopFn}
            >
                <PlayLine key={chordLine.id} chordLine={chordLine} />
            </IntersectingElement>
        );
    };

    const playLines = lines.list.map(makePlayLine);

    // useNavigationKeys(scrollDown, scrollUp);

    return (
        <FocusedElement>
            <Box>{playLines}</Box>
        </FocusedElement>
    );
};

export default ScrollPlayContent;
