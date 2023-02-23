import { ChordLine } from "common/ChordModel/ChordLine";
import { PlainFn } from "common/PlainFn";
import PlayLine from "components/play/common/PlayLine";
import ColourBorderBox from "components/play/scroll/ColourBorderBox";
import { useInPageView } from "components/play/scroll/useInPageView";
import { useScrollable } from "components/play/scroll/useScrollable";
import React, { useCallback } from "react";

interface ViewportMarginPercentage {
    top: number;
    bottom: number;
}

// these values determine the portion of the viewport that is used to consider
// the next line that the user can scroll to
// e.g. top: -25, bottom: -25 is equivalent to the area 25% vh to 75% vh from the top

// the top area prevents scrolls that end up only scrolling 1-2 lines because
// the upcoming section is very near the top
const topPortionMargin: ViewportMarginPercentage = {
    top: 0,
    bottom: -70,
};

// the bottom area prevents a super big jump, so the user has some lookahead
// and isn't scrolled to an entirely new section without continuity
const bottomPortionMargin: ViewportMarginPercentage = {
    top: -70,
    bottom: 0,
};

const currentViewportMargin: ViewportMarginPercentage = {
    top: 0,
    bottom: 0,
};

// these percentages project one viewport height above the current viewport,
// that is, the area if the user scrolled up 100vh
// this is used to scroll backwards and it can be 100% since the user
// cannot lookahead backwards (nor is that a meaningful usecase)
const previousViewportMargin: ViewportMarginPercentage = {
    top: 100,
    bottom: -100,
};

interface InViewCallbacks {
    currentView: (isInView: () => boolean) => void;
    previousView: (isInView: () => boolean) => void;
    topPortion: (isInView: () => boolean) => void;
    bottomPortion: (isInView: () => boolean) => void;
}

interface ScrollablePlayLineProps {
    chordLine: ChordLine;
    colourBorder: boolean;
    inViewCallbacks: InViewCallbacks;
    scrollFnCallback: (scrollFn: PlainFn) => void;
    inViewChanged: PlainFn;
}

const ScrollablePlayLine = React.memo(
    (props: ScrollablePlayLineProps): JSX.Element => {
        const currentPageInViewRef = useInPageView({
            topMarginPercentage: currentViewportMargin.top,
            bottomMarginPercentage: currentViewportMargin.bottom,
            isInViewFnCallback: props.inViewCallbacks.currentView,
            inViewChanged: props.inViewChanged,
        });

        const previousPageInViewRef = useInPageView({
            topMarginPercentage: previousViewportMargin.top,
            bottomMarginPercentage: previousViewportMargin.bottom,
            isInViewFnCallback: props.inViewCallbacks.previousView,
        });

        const topPortionInViewRef = useInPageView({
            topMarginPercentage: topPortionMargin.top,
            bottomMarginPercentage: topPortionMargin.bottom,
            isInViewFnCallback: props.inViewCallbacks.topPortion,
        });

        const bottomPortionInViewRef = useInPageView({
            topMarginPercentage: bottomPortionMargin.top,
            bottomMarginPercentage: bottomPortionMargin.bottom,
            isInViewFnCallback: props.inViewCallbacks.bottomPortion,
        });

        const scrollRef = useScrollable(props.scrollFnCallback);

        const captureRef = useCallback(
            (elem: Element | null) => {
                if (elem !== null) {
                    scrollRef.current = elem;
                    currentPageInViewRef(elem);
                    previousPageInViewRef(elem);
                    topPortionInViewRef(elem);
                    bottomPortionInViewRef(elem);
                } else {
                    scrollRef.current = undefined;
                    currentPageInViewRef(null);
                    previousPageInViewRef(null);
                    topPortionInViewRef(null);
                    bottomPortionInViewRef(null);
                }
            },
            [
                currentPageInViewRef,
                previousPageInViewRef,
                topPortionInViewRef,
                bottomPortionInViewRef,
                scrollRef,
            ]
        );

        return (
            <ColourBorderBox ref={captureRef} highlight={props.colourBorder}>
                <PlayLine chordLine={props.chordLine} />
            </ColourBorderBox>
        );
    }
);

export default ScrollablePlayLine;
