import { Box, CircularProgress, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

const CenteredBox = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        margin: theme.spacing(0.5),
    },
}))(Box);

const WaitingSpinner: React.FC<{}> = (): JSX.Element => {
    return (
        <CenteredBox>
            <CircularProgress />
        </CenteredBox>
    );
};

export default WaitingSpinner;
