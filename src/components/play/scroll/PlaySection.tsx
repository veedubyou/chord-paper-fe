import { Box, RootRef } from "@material-ui/core";
import React, { useRef } from "react";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import PlayLine from "../common/PlayLine";

export type SectionedChordLines = ChordLine[];

export interface ScrollableElement {
    scrollIntoView: PlainFn;
    getInView: () => "in-view" | "not-in-view";
}

interface PlaySectionProps {
    chordLines: SectionedChordLines;
    scrollableElementRefCallback: (scrollableElement: ScrollableElement) => void;
}

const PlaySection: React.FC<PlaySectionProps> = (
    props: PlaySectionProps
): JSX.Element => {
    const ref = useRef<Element>();

    const scrollIntoView = () =>
        ref.current?.scrollIntoView({ behavior: "smooth" });

    const getInView = (): "in-view" | "not-in-view" => {
        const currentElement = ref.current;
        if (currentElement === undefined) {
            return "not-in-view";
        }

        const clientRect = currentElement.getBoundingClientRect();
        if (clientRect.bottom < 0) {
            return "not-in-view";
        }

        const windowHeight = document.documentElement.clientHeight;
        if (clientRect.top > windowHeight) {
            return "not-in-view";
        }

        return "in-view";
    };

    const scrollableElement: ScrollableElement = {
        scrollIntoView: scrollIntoView,
        getInView: getInView,
    };

    props.scrollableElementRefCallback(scrollableElement);

    const makePlayLine = (chordLine: ChordLine) => (
        <PlayLine chordLine={chordLine} />
    );
    const playLines = props.chordLines.map(makePlayLine);

    return (
        <RootRef rootRef={ref}>
            <Box>{playLines}</Box>
        </RootRef>
    );
};

export const sectionChordLines = (song: ChordSong): SectionedChordLines[] => {
    if (song.chordLines.length === 0) {
        return [];
    }

    const sections: SectionedChordLines[] = [];
    const getLastSection = (): SectionedChordLines => {
        const lastIndex = sections.length - 1;
        return sections[lastIndex];
    };

    song.chordLines.forEach((chordLine: ChordLine) => {
        const hasNewSection = chordLine.section !== undefined;
        const noExistingSectionsInList = sections.length === 0;

        if (hasNewSection || noExistingSectionsInList) {
            sections.push([]);
        }

        const lastSection = getLastSection();
        lastSection.push(chordLine);
    });

    return sections;
};

export default PlaySection;
