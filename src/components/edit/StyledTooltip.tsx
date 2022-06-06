import {
    styled,
    Theme,
    Tooltip,
    tooltipClasses,
    TooltipProps
} from "@mui/material";
import { StandardCSSProperties } from "@mui/system";
import React from "react";

export type TooltipStylesInput = (theme: Theme) => StandardCSSProperties;

// crazy nonsense: https://mui.com/material-ui/react-tooltip/#customization
// tl;dr, tooltip needs to be styled in a very particular way that overrides its own classname
// and also targets its child elements. it's very easy to miss so making it a utility
export const makeStyledTooltipMenu = (styleInput: TooltipStylesInput) => {
    return styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => {
        const styles = styleInput(theme);

        return {
            // this tooltip isn't meant to paint over any other surfaces
            // but extend as an adjacent menu to the line, so z index is 0
            zIndex: 0,
            [`& .${tooltipClasses.tooltip}`]: styles,
        };
    });
};
