import { Box } from "@material-ui/core";
import React, { useCallback, useRef } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { noopFn } from "../../../common/PlainFn";
import FocusedElement from "../common/FocusedElement";
import PlaySection, {
    ScrollableElement,
    sectionChordLines,
    SectionedChordLines
} from "./PlaySection";
import { useNavigationKeys } from "../common/useNavigateKeys";

interface ScrollPlayContentProps {
    song: ChordSong;
}

const ScrollPlayContent: React.FC<ScrollPlayContentProps> = (
    props: ScrollPlayContentProps
): JSX.Element => {
    const sections = sectionChordLines(props.song);

    const createEmptyRefs = useCallback(
        (sectionLength: number): ScrollableElement[] => {
            const newRefs: ScrollableElement[] = [];

            for (let i = 0; i < sectionLength; i++) {
                newRefs.push({
                    getInView: () => "not-in-view",
                    scrollIntoView: noopFn,
                });
            }

            return newRefs;
        },
        []
    );

    const sectionRefs = useRef<ScrollableElement[]>(
        createEmptyRefs(sections.length)
    );

    const getTopInViewSectionIndex = (): number | null => {
        for (let i = 0; i < sectionRefs.current.length; i++) {
            const sectionVisibility = sectionRefs.current[i];
            if (sectionVisibility === null) {
                continue;
            }

            if (sectionVisibility.getInView() === "in-view") {
                return i;
            }
        }

        return null;
    };

    const scrollDown = (): boolean => {
        const topInViewIndex = getTopInViewSectionIndex();
        if (topInViewIndex === null) {
            console.error("Can't find top index");
            return false;
        }

        const hasNextSection = topInViewIndex < sectionRefs.current.length - 1;
        const shouldScrollToNextSection: boolean = (() => {
            if (!hasNextSection) {
                return false;
            }

            const nextElement = sectionRefs.current[topInViewIndex + 1];
            const nextElementInView = nextElement.getInView() === "in-view";
            return nextElementInView;
        })();

        if (shouldScrollToNextSection) {
            sectionRefs.current[topInViewIndex + 1].scrollIntoView();
        } else {
            const windowHeight = document.documentElement.clientHeight;
            const scrollDistance = windowHeight * 0.75;
            window.scrollBy({
                behavior: "smooth",
                left: 0,
                top: scrollDistance,
            });
        }

        return true;
    };

    useNavigationKeys(scrollDown, () => false);

    const playSections = sections.map(
        (sectionedChordLines: SectionedChordLines, sectionIndex: number) => {
            const assignRef = (ref: ScrollableElement) => {
                sectionRefs.current[sectionIndex] = ref;
            };

            return (
                <PlaySection
                    key={sectionIndex}
                    chordLines={sectionedChordLines}
                    scrollableElementRefCallback={assignRef}
                />
            );
        }
    );

    return (
        <FocusedElement>
            <Box>{playSections}</Box>
        </FocusedElement>
    );
};

export default ScrollPlayContent;
