import { Grid, Paper, Theme, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        minWidth: theme.spacing(92),
        position: "relative",
    },
}))(Paper);

const ErrorPage: React.FC<{}> = (): JSX.Element => {
    return (
        <Grid container data-testid="Tutorial">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    <Typography>An Error Occurred Oh No</Typography>
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export default ErrorPage;
