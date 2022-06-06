import { PlainFn } from "common/PlainFn";
import React, { useCallback, useRef } from "react";

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
