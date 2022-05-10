import { RootRef } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PlainFn } from "../../../common/PlainFn";

export interface ViewportElement {
    scrollIntoView: PlainFn;
    isInView: () => boolean;
}

type IsInViewFn = () => boolean;

interface InViewElementProps {
    children: React.ReactElement;
    isInViewFnCallback?: (isInView: IsInViewFn) => void;
    inViewChanged?: PlainFn;
    topMarginPercentage: number;
    bottomMarginPercentage: number;
}

const InViewElement: React.FC<InViewElementProps> = (
    props: InViewElementProps
): JSX.Element => {
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.9,
        rootMargin: `${props.topMarginPercentage}% 0px ${props.bottomMarginPercentage}% 0px`,
    });

    const inViewCache = useRef(false);
    const inViewChanged = props.inViewChanged;

    props.isInViewFnCallback?.(() => inViewCache.current);

    useEffect(() => {
        inViewCache.current = inView;
        inViewChanged?.();
    }, [inView, inViewChanged]);

    return <RootRef rootRef={inViewRef}>{props.children}</RootRef>;
};

export default InViewElement;
