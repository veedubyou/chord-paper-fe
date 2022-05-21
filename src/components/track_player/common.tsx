import { Box, BoxProps, Theme, TypographyVariant } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import React from "react";

export const roundedTopCornersStyle = (theme: Theme) => ({
    borderTopLeftRadius: theme.spacing(1.5),
    borderTopRightRadius: theme.spacing(1.5),
});

export const roundedCornersStyle = (theme: Theme) => ({
    borderRadius: theme.spacing(1.5),
});

export const controlPaneStyle = {
    backgroundColor: blueGrey[50],
    display: "flex",
    alignItems: "center",
};

// pretty wild stuff, but I've come across some circumstances where I want
// to provide a min width to an element so that its surrounding elements
// do not shift
//
// flexbox was considered but it required some magic guess of the container's
// width, which is just as uneducated as any other guess
//
// suppose you have a box that contains a number that's unlikely go to beyond
// 200 - and suppose 200 is the largest width that the value can be
// (e.g. perhaps in some fonts 199 is wider, then you'd use that)
// then minWidthOf(theme, "body", "200") would return a size to use as the minWidth
// so that the range of values will not change the size of the container
// or move its surrounding elements
export const widthOfString = (
    theme: Theme,
    typographyVariant: TypographyVariant,
    phattestString: string
): string | undefined => {
    const typography = theme.typography[typographyVariant];

    const font: string | undefined = (() => {
        if (typography.fontFamily === undefined) {
            return undefined;
        }

        if (typography.fontSize === undefined) {
            return undefined;
        }

        return `${typography.fontSize} ${typography.fontFamily}`;
    })();

    if (font === undefined) {
        return undefined;
    }

    const canvas = document.createElement("canvas");
    const canvasContext = canvas.getContext("2d");
    if (canvasContext === null) {
        return undefined;
    }

    canvasContext.font = font;
    const measurement = canvasContext.measureText(phattestString);
    return `${measurement.width}px`;
};

export const greyTextColour = grey[700];

const BottomRightBox = styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    right: theme.spacing(2),
    // just bump the z index slightly to above 0 to cover most things
    zIndex: 1,
    ...roundedTopCornersStyle(theme),
}));

export const withBottomRightBox = (children: React.ReactElement) => {
    return (
        <BottomRightBox boxShadow={4}>
            {children}
        </BottomRightBox>
    );
};

export const TitleBar = styled(Box)<BoxProps>(({ theme }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...roundedTopCornersStyle(theme),
}));

export type CollapsibleMenuVisibility = "collapsed" | "expanded" | "hidden";
