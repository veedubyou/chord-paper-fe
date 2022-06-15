import { ChordLine } from "common/ChordModel/ChordLine";
import { PlainFn } from "common/PlainFn";
import PlayLine from "components/play/common/PlayLine";
import ColourBorderBox from "components/play/scroll/ColourBorderBox";
import { useInPageView } from "components/play/scroll/useInPageView";
import { useScrollable } from "components/play/scroll/useScrollable";
import React, { useCallback } from "react";

// these values determine the portion of the viewport that is used to consider
// the next line that the user can scroll to
// e.g. top: -25, bottom: -25 is equivalent to the area 25% vh to 75% vh from the top

// the top margin prevents scrolls that end up only scrolling 1-2 lines because
// the upcoming section is very near the top
const topCurrentViewportMarginPercent = -25;
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
    colourBorder: boolean;
    isInCurrentViewFnCallback: (isInView: () => boolean) => void;
    isInPreviousViewFnCallback: (isInView: () => boolean) => void;
    scrollFnCallback: (scrollFn: PlainFn) => void;
    inViewChanged: PlainFn;
}

const ScrollablePlayLine = React.memo(
    (props: ScrollablePlayLineProps): JSX.Element => {
        const currentPageInViewRef = useInPageView({
            topMarginPercentage: topCurrentViewportMarginPercent,
            bottomMarginPercentage: bottomCurrentViewportMarginPercent,
            isInViewFnCallback: props.isInCurrentViewFnCallback,
            inViewChanged: props.inViewChanged,
        });

        const previousPageInViewRef = useInPageView({
            topMarginPercentage: topPreviousViewportMarginPercent,
            bottomMarginPercentage: bottomPreviousViewportMarginPercent,
            isInViewFnCallback: props.isInPreviousViewFnCallback,
        });

        const scrollRef = useScrollable(props.scrollFnCallback);

        const captureRef = useCallback(
            (elem: Element | null) => {
                if (elem !== null) {
                    scrollRef.current = elem;
                    currentPageInViewRef(elem);
                    previousPageInViewRef(elem);
                } else {
                    scrollRef.current = undefined;
                    currentPageInViewRef(null);
                    previousPageInViewRef(null);
                }
            },
            [currentPageInViewRef, previousPageInViewRef, scrollRef]
        );

        return (
            <ColourBorderBox ref={captureRef} highlight={props.colourBorder}>
                <PlayLine chordLine={props.chordLine} />
            </ColourBorderBox>
        );
    }
);

export default ScrollablePlayLine;
