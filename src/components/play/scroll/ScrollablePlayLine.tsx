import React from "react";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { PlainFn } from "../../../common/PlainFn";
import PlayLine from "../common/PlayLine";
import HighlightBorderBox from "./HighlightBorderBox";
import InViewElement from "./InViewElement";
import ScrollingElement from "./ScrollingElement";

// these values determine the portion of the viewport that is used to consider
// the next line that the user can scroll to
// e.g. top: -15, bottom: -25 is equivalent to the area 15% vh to 75% vh from the top

// the top margin prevents scrolls that end up only scrolling 1-2 lines because
// the upcoming section is very near the top
const topCurrentViewportMarginPercent = -15;
// the bottom margin prevents a super big jump, so the user has some lookahead
// and isn't scrolled to an entirely new section without continuity
const bottomCurrentViewportMarginPercent = -25;

// these percentages project one viewport height above the current viewport,
// that is, the area if the user scrolled up 100vh
// this is used to scroll backwards and it can be 100% since the user
// cannot lookahead backwards (nor is that a meaningful usecase)
const topPreviousViewportMarginPercent = 100;
const bottomPreviousViewportMarginPercent = -100;

interface ScrollablePlayLineProps {
    chordLine: ChordLine;
    highlight: boolean;
    isInCurrentViewFnCallback: (isInView: () => boolean) => void;
    isInPreviousViewFnCallback: (isInView: () => boolean) => void;
    scrollFnCallback: (scrollFn: PlainFn) => void;
    inViewChanged: PlainFn;
}

const ScrollablePlayLine: React.FC<ScrollablePlayLineProps> = (
    props: ScrollablePlayLineProps
): JSX.Element => {
    return (
        <InViewElement
            topMarginPercentage={topCurrentViewportMarginPercent}
            bottomMarginPercentage={bottomCurrentViewportMarginPercent}
            isInViewFnCallback={props.isInCurrentViewFnCallback}
            inViewChanged={props.inViewChanged}
        >
            <InViewElement
                topMarginPercentage={topPreviousViewportMarginPercent}
                bottomMarginPercentage={bottomPreviousViewportMarginPercent}
                isInViewFnCallback={props.isInPreviousViewFnCallback}
            >
                <ScrollingElement scrollFnCallback={props.scrollFnCallback}>
                    <HighlightBorderBox highlight={props.highlight}>
                        <PlayLine chordLine={props.chordLine} />
                    </HighlightBorderBox>
                </ScrollingElement>
            </InViewElement>
        </InViewElement>
    );
};

export default ScrollablePlayLine;
