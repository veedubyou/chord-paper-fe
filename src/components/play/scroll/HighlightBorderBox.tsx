import { Box, Theme } from "@mui/material";
import React from "react";
import { makeHighlightBorders } from "./highlightBorderContext";

const transitionFunction = "cubic-bezier(.19,1,.22,1)";

const useHighlightBorder = makeHighlightBorders();

interface HighlightBorderBoxProps {
    highlight?: boolean;
    children: React.ReactElement;
}

const HighlightBorderBox = React.forwardRef(
    (
        props: HighlightBorderBoxProps,
        ref: React.ForwardedRef<Element>
    ): JSX.Element => {
        const highlightBorderStyle = useHighlightBorder();

        const highlightClassName: string | undefined = (() => {
            if (props.highlight === true) {
                return highlightBorderStyle.root;
            }

            return undefined;
        })();

        return (
            <Box
                ref={ref}
                className={highlightClassName}
                sx={(theme: Theme) => ({
                    borderColor: "transparent",
                    borderStyle: "dashed",
                    borderRadius: theme.spacing(1.5),
                    borderWidth: theme.spacing(0.3),
                    transition: `border-color ${transitionFunction} 2s`,
                })}
            >
                {props.children}
            </Box>
        );
    }
);

export default HighlightBorderBox;
