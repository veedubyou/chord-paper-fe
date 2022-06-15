import { Box, Theme } from "@mui/material";
import { useColourBorders } from "components/play/scroll/colourBorderContext";
import React from "react";

const transitionFunction = "cubic-bezier(.19,1,.22,1)";

interface ColourBorderBoxProps {
    highlight?: boolean;
    children: React.ReactElement;
}

const ColourBorderBox = React.forwardRef(
    (
        props: ColourBorderBoxProps,
        ref: React.ForwardedRef<Element>
    ): JSX.Element => {
        const colourBorderStyle = useColourBorders();

        const containerStyle = (() => {
            if (props.highlight === true) {
                return colourBorderStyle;
            }

            // do nothing, but make it a function so it's easier to spread
            // in the SX expression below
            return (theme: Theme) => undefined;
        })();

        return (
            <Box
                ref={ref}
                sx={(theme: Theme) => ({
                    borderColor: "transparent",
                    borderStyle: "dashed",
                    borderRadius: theme.spacing(1.5),
                    borderWidth: theme.spacing(0.3),
                    transition: `border-color ${transitionFunction} 2s`,
                    ...containerStyle(theme),
                })}
            >
                {props.children}
            </Box>
        );
    }
);

export default ColourBorderBox;
