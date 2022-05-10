import { RootRef } from "@material-ui/core";
import React, { useRef } from "react";
import { PlainFn } from "../../../common/PlainFn";

export interface ViewportElement {
    scrollIntoView: PlainFn;
    isInView: () => boolean;
}

interface ScrollingElementProps {
    children: React.ReactElement;
    scrollFnCallback: (scrollFn: PlainFn) => void;
}

const ScrollingElement: React.FC<ScrollingElementProps> = (
    props: ScrollingElementProps
): JSX.Element => {
    const scrollRef = useRef<Element>();

    props.scrollFnCallback(() =>
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    );

    return <RootRef rootRef={scrollRef}>{props.children}</RootRef>;
};

export default ScrollingElement;
