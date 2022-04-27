import { Box } from "@material-ui/core";
import React, { useCallback, useRef } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { noopFn } from "../../../common/PlainFn";
import FocusedElement from "../common/FocusedElement";
import { useNavigationKeys } from "../common/useNavigateKeys";
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

    const getTopVisibleSection = (): {
        index: number;
        visibility: Visibility;
    } | null => {
        let firstInViewSection: {
            index: number;
            visibility: Visibility;
        } | null = null;
        for (let i = 0; i < sectionRefs.current.length; i++) {
            const sectionVisibility = sectionRefs.current[i];
            if (sectionVisibility === null) {
                continue;
            }

            const visibility = sectionVisibility.getInView();

            // return the section whose box top is near the top of the viewport if available
            // this would best approximate what the user is seeing in terms of which
            // section is at the top of the screen
            if (visibility === "at-top") {
                return {
                    index: i,
                    visibility: "at-top",
                };
            }

            // otherwise, capture the first section that is in view
            // we don't return this right away because the next section could be
            // near the top of the viewport
            // e.g. section A shows 5 px of height at the top of the screen
            // and section B has their box top at 5 px from the top, then we
            // want to classify section B as the "first section"
            if (visibility === "in-view" && firstInViewSection === null) {
                firstInViewSection = {
                    index: i,
                    visibility: "in-view",
                };
            }
        }

        return firstInViewSection;
    };

    // scrollDown and scrollUp are unexpectedly not symmetrical functions
    // explanation attached with each function
    
    // scrolls down to the next section head if it's in view
    // otherwise scrolls down a bit (like page down)
    // the idea is that the user can thoroughly navigate the entire song
    // using just scrollDown without missing any lyrics/chords
    const scrollDown = (): boolean => {
        const currentSection = getTopVisibleSection();
        if (currentSection === null) {
            console.error(
                "Can't find the section that's at the top of the viewport"
            );
            return false;
        }

        const hasNextSection =
            currentSection.index < sectionRefs.current.length - 1;
        const shouldScrollToNextSection: boolean = (() => {
            if (!hasNextSection) {
                return false;
            }

            const nextSectionRef =
                sectionRefs.current[currentSection.index + 1];
            return nextSectionRef.getInView() === "in-view";
        })();

        if (shouldScrollToNextSection) {
            const nextSectionRef =
                sectionRefs.current[currentSection.index + 1];
            nextSectionRef.scrollIntoView();
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

    // scrolls up to the section head above the viewport,
    // which could correspond to the current or previous section
    // unlike scrollDown, this may skip some lyrics/chords
    // but the idea is that the user is "rewinding" through sections
    // and not going through the song in reverse
    // so therefore it's ok to skip some content
    const scrollUp = (): boolean => {
        const currentSection = getTopVisibleSection();
        if (currentSection === null) {
            console.error(
                "Can't find the section that's at the top of the viewport"
            );
            return false;
        }

        const hasPreviousSection = currentSection.index > 0;

        if (hasPreviousSection && currentSection.visibility === "at-top") {
            const previousSectionRef =
                sectionRefs.current[currentSection.index - 1];
            previousSectionRef.scrollIntoView();
        } else {
            const currentSectionRef = sectionRefs.current[currentSection.index];
            currentSectionRef.scrollIntoView();
        }

        return true;
    };

    useNavigationKeys(scrollDown, scrollUp);

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
