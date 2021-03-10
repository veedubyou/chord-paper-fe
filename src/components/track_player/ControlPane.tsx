import { Box } from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";
import { withStyles } from "@material-ui/styles";
import React from "react";

const PaneBody = withStyles({
    root: {
        backgroundColor: blueGrey[50],
        display: "flex",
        alignItems: "center",
    },
})(Box);

interface ControlPaneProps {
    children: React.ReactNode;
}

const ControlPane: React.FC<ControlPaneProps> = (
    props: ControlPaneProps
): JSX.Element => {
    return <PaneBody>{props.children}</PaneBody>;
};

export default ControlPane;
