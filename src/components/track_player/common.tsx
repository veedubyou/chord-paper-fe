import { Box as UnstyledBox, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const roundedTopCornersStyle = (theme: Theme) => ({
    borderTopLeftRadius: theme.spacing(1.5),
    borderTopRightRadius: theme.spacing(1.5),
});

export const roundedCornersStyle = (theme: Theme) => ({
    borderRadius: theme.spacing(1.5),
});

const Box = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: 0,
        right: theme.spacing(2),
        ...roundedTopCornersStyle(theme),
    },
}))(UnstyledBox);

interface BottomRightBoxProps {
    children: React.ReactElement;
}

export const BottomRightBox: React.FC<BottomRightBoxProps> = (
    props: BottomRightBoxProps
): JSX.Element => {
    return <Box boxShadow={4}>{props.children}</Box>;
};
