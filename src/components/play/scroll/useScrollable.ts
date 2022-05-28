import React, { useCallback, useRef } from "react";
import { PlainFn } from "../../../common/PlainFn";

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
