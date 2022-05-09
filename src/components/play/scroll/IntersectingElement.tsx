import { Box, RootRef, Theme } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { PlainFn } from "../../../common/PlainFn";

const BorderedBox = withStyles((theme: Theme) => ({
    root: {
        borderColor: "transparent",
        borderStyle: "dashed",
        borderRadius: theme.spacing(1.5),
        borderWidth: theme.spacing(0.3),
        transition: "border-color 2s",
    },
}))(Box);

const useHighlightedBorder = makeStyles((theme: Theme) => ({
    root: {
        borderColor: theme.palette.primary.main,
    },
}));

export interface ViewportElement {
    scrollIntoView: PlainFn;
    isInView: () => boolean;
}

interface IntersectingElementProps {
    highlight?: boolean;
    children: React.ReactElement;
    viewportElementRefCallback: (viewportElement: ViewportElement) => void;
    inViewChanged: PlainFn;
}

const IntersectingElement: React.FC<IntersectingElementProps> = (
    props: IntersectingElementProps
): JSX.Element => {
    const { ref: inViewRef, inView } = useInView({
        rootMargin: "0px 0px -25% 0px",
    });
    const scrollRef = useRef<Element>();
    const inViewCache = useRef(false);
    const highlightBorderStyle = useHighlightedBorder();

    const inViewChanged = props.inViewChanged;

    props.viewportElementRefCallback({
        isInView: () => inViewCache.current,
        scrollIntoView: () =>
            scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
    });

    useEffect(() => {
        inViewCache.current = inView;
        inViewChanged();
    }, [inView, inViewChanged]);

    const highlightClassName: string | undefined = (() => {
        if (props.highlight === true) {
            return highlightBorderStyle.root;
        }

        return undefined;
    })();

    return (
        <RootRef rootRef={inViewRef}>
            <RootRef rootRef={scrollRef}>
                <BorderedBox className={highlightClassName}>
                    {props.children}
                </BorderedBox>
            </RootRef>
        </RootRef>
    );
};

export default IntersectingElement;
