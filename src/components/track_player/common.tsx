import { Box, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const roundedTopCornersStyle = (theme: Theme) => ({
    borderTopLeftRadius: theme.spacing(1.5),
    borderTopRightRadius: theme.spacing(1.5),
});

const BottomRightBox = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: 0,
        right: theme.spacing(2),
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

export const withBottomRightBox = (children: React.ReactElement) => (
    <BottomRightBox boxShadow={4}>{children}</BottomRightBox>
);
