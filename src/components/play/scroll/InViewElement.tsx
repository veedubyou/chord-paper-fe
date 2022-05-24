import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PlainFn } from "../../../common/PlainFn";

export interface ViewportElement {
    scrollIntoView: PlainFn;
    isInView: () => boolean;
}

type IsInViewFn = () => boolean;

interface InViewElementProps {
    topMarginPercentage: number;
    bottomMarginPercentage: number;
    isInViewFnCallback?: (isInView: IsInViewFn) => void;
    inViewChanged?: PlainFn;
}

type InViewRef = (node: Element | null | undefined) => void;

export const useInViewElement = (props: InViewElementProps): InViewRef => {
    console.log("useInViewElement");
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

    return inViewRef;
};
