import { Grid, Paper, Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { inflatingWhitespace } from "../../common/Whitespace";
import CenteredLayoutWithMenu from "../display/CenteredLayoutWithMenu";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(5),
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
                    <Typography>{inflatingWhitespace()}</Typography>
                    <Typography>
                        Background audio separation is built on{" "}
                        <a href="https://github.com/deezer/spleeter">
                            Spleeter
                        </a>
                        .
                    </Typography>
                    <Typography>{inflatingWhitespace()}</Typography>
                    <Typography>Credits:</Typography>
                    <Typography>
                        Kubernetes infrastructure and deployment:{" "}
                        <a href="https://github.com/pw1124">@pw1124</a>
                    </Typography>
                    <Typography>
                        Initial design (all the good parts!): Key
                    </Typography>
                    <Typography>
                        Everything else:{" "}
                        <a href="https://github.com/veedubyou">@veedubyou</a>
                    </Typography>
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

const AboutScreen: React.FC<{}> = (): JSX.Element => {
    return (
        <CenteredLayoutWithMenu>
            <About />
        </CenteredLayoutWithMenu>
    );
};

export default AboutScreen;
