import { Box, styled, Theme } from "@mui/material";
import { alpha } from "@mui/system";
import { PlayerSectionContext } from "components/PlayerSectionContext";
import React, { useContext } from "react";

export interface LineWithSectionHighlightProps {
    children: React.ReactElement | React.ReactElement[];
    sectionID: string | null;
    top?: boolean;
    bottom?: boolean;
}

const transitionFunction = "cubic-bezier(.19,1,.22,1)";

const SmoothTransitionBox = styled(Box)({
    transition: `background-color ${transitionFunction} 0.5s`,
});

const backgroundColorStyle = (theme: Theme) => ({
    backgroundColor: alpha(theme.palette.primary.dark, 0.1),
});

const topLineStyle = (theme: Theme) => ({
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
});

const bottomLineStyle = (theme: Theme) => ({
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
});

const LineWithSectionHighlight: React.FC<LineWithSectionHighlightProps> = (
    props: LineWithSectionHighlightProps
): JSX.Element => {
    const currentSectionItem = useContext(PlayerSectionContext);

    if (
        currentSectionItem === null ||
        currentSectionItem.timestampedSection.lineID !== props.sectionID
    ) {
        return <SmoothTransitionBox>{props.children}</SmoothTransitionBox>;
    }

    const sxFn = (theme: Theme) => {
        let style = backgroundColorStyle(theme);
        if (props.top === true) {
            style = {
                ...style,
                ...topLineStyle(theme),
            };
        }

        if (props.bottom === true) {
            style = {
                ...style,
                ...bottomLineStyle(theme),
            };
        }

        return style;
    };

    return (
        <SmoothTransitionBox sx={sxFn}>{props.children}</SmoothTransitionBox>
    );
};

export default LineWithSectionHighlight;
