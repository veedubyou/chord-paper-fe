import React, { useCallback, useRef } from "react";
import { PlainFn } from "../../../common/PlainFn";

export interface ViewportElement {
    scrollIntoView: PlainFn;
    isInView: () => boolean;
}

interface ScrollingElementProps {
    children: React.ReactElement;
    scrollFnCallback: (scrollFn: PlainFn) => void;
}

export const useScrollable = (
    scrollFnCallback: (scrollFn: PlainFn) => void
): React.MutableRefObject<Element | undefined> => {
    const scrollRef = useRef<Element>();

    const scrollFn = useCallback(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        []
    );

    scrollFnCallback(scrollFn);

    return scrollRef;
};

const ScrollingElement: React.FC<ScrollingElementProps> = (
    props: ScrollingElementProps
): JSX.Element => {
    const scrollRef = useRef<Element>();

    props.scrollFnCallback(() =>
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    );

    return <>{props.children}</>;
};

export default ScrollingElement;
