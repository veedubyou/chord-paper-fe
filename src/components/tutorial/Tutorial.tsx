import React from "react";
import {
    Paper,
    Typography,
    Theme,
    Grid,
    Box,
    Fab as UnstyledFab,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { inflatingWhitespace } from "../../common/Whitespace";
import Playground from "./exercises/Playground";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { LineBreak } from "./exercises/Common";
import EditChord from "./exercises/EditChord";
import UnstyledPlayArrowIcon from "@material-ui/icons/PlayArrow";

const PlayArrowIcon = withStyles({
    root: {
        color: "white",
    },
})(UnstyledPlayArrowIcon);

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        minWidth: theme.spacing(92),
        position: "relative",
    },
}))(Paper);

const Fab = withStyles((theme: Theme) => ({
    root: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}))(UnstyledFab);

const Header = () => {
    return <Typography variant="h5">Learning Chord Paper</Typography>;
};

const Preamble = () => {
    return (
        <>
            <Typography>
                Chord Paper aims to be as intuitive and handy as possible, but
                there could still be features that you don't know about
                immediately. Let's walk through the basics together!
            </Typography>
            <Typography>
                Since Chord Paper is still in early stages, some of these could
                change in the future.
            </Typography>
        </>
    );
};

const Tutorial: React.FC<{}> = (): JSX.Element => {
    return (
        <Grid container data-testid="Tutorial">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    <Header />
                    <LineBreak />
                    <Preamble />
                    <EditChord />
                    <Fab color="primary">
                        <PlayArrowIcon />
                    </Fab>
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export default Tutorial;
