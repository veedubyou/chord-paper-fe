import { Grid, Paper, Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { inflatingWhitespace } from "../../common/Whitespace";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        minWidth: theme.spacing(92),
    },
}))(Paper);

const About: React.FC<{}> = (): JSX.Element => {
    return (
        <Grid container data-testid="About">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    <Typography variant="h6">About Chord Paper</Typography>
                    <Typography variant="h6">
                        {inflatingWhitespace()}
                    </Typography>
                    <Typography>
                        Chord Paper makes writing and reading chord sheets
                        easier than the traditional monospace font formatting.
                        It's a passion project born out of frustration at the
                        clunkiness of writing chords on a computer.
                    </Typography>
                    <Typography>{inflatingWhitespace()}</Typography>
                    <Typography>
                        Hope you will find that Chord Paper helps you focus more
                        of your musical time on playing and listening, and less
                        on formatting.
                    </Typography>
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export default About;
