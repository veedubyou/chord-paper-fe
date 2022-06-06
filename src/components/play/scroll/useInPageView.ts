import { PlainFn } from "common/PlainFn";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

type IsInViewFn = () => boolean;

interface useInPageViewProps {
    topMarginPercentage: number;
    bottomMarginPercentage: number;
    isInViewFnCallback: (isInView: IsInViewFn) => void;
    inViewChanged?: PlainFn;
}

type InViewRef = (node: Element | null | undefined) => void;

export const useInPageView = (props: useInPageViewProps): InViewRef => {
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.9,
        rootMargin: `${props.topMarginPercentage}% 0px ${props.bottomMarginPercentage}% 0px`,
    });

    const inViewCache = useRef(false);
    const inViewChanged = props.inViewChanged;

    props.isInViewFnCallback(() => inViewCache.current);

    useEffect(() => {
        const oldValue = inViewCache.current;
        if (oldValue !== inView) {
            inViewCache.current = inView;
            inViewChanged?.();
        }
    }, [inView, inViewChanged]);

    return inViewRef;
};
