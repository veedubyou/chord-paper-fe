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
import { inflatingWhitespace } from "../../../common/Whitespace";
import Playground from "./Playground";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { LineBreak } from "./Common";
import EditChord from "./EditChord";
import UnstyledPlayArrowIcon from "@material-ui/icons/PlayArrow";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import RemoveChord from "./RemoveChord";
import AddChord from "./AddChord";
import EditLyrics from "./EditLyrics";
import ChordPositioning from "./ChordPositioning";
import AddLine from "./AddLine";
import RemoveLine from "./RemoveLine";
import PasteLyrics from "./PasteLyrics";
import MergeLine from "./MergeLine";
import Starting from "./Start";
import ErrorPage from "../../ErrorPage";

type ExerciseEntry = {
    title: string;
    route: string;
    component: React.FC<{}>;
};

export type ExerciseRoute = {
    title: string;
    route: string;
};

const allExercises: ExerciseEntry[] = [
    {
        title: "Starting",
        route: "/learn/start",
        component: Starting,
    },
    {
        title: "Edit a Chord",
        route: "/learn/edit_chord",
        component: EditChord,
    },
    {
        title: "Remove a Chord",
        route: "/learn/remove_chord",
        component: RemoveChord,
    },
    {
        title: "Add a Chord",
        route: "/learn/add_chord",
        component: AddChord,
    },
    {
        title: "Edit Lyrics",
        route: "/learn/edit_lyrics",
        component: EditLyrics,
    },
    {
        title: "Chord Positioning",
        route: "/learn/chord_positioning",
        component: ChordPositioning,
    },
    {
        title: "Adding New Line",
        route: "/learn/add_line",
        component: AddLine,
    },
    {
        title: "Removing a Line",
        route: "/learn/remove_line",
        component: RemoveLine,
    },
    {
        title: "Pasting Lyrics",
        route: "/learn/paste_lyrics",
        component: PasteLyrics,
    },
    {
        title: "Merging Lines",
        route: "/learn/merge_lines",
        component: MergeLine,
    },
];

export const allExerciseRoutes = (): ExerciseRoute[] => {
    return allExercises.map((entry: ExerciseEntry) => ({
        title: entry.title,
        route: entry.route,
    }));
};

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

interface TutorialProps {
    route: string;
}

export const TutorialSwitches = (): React.ReactElement[] => {
    return allExercises.map((exerciseEntry: ExerciseEntry) => (
        <Route exact path={exerciseEntry.route}>
            <Tutorial route={exerciseEntry.route} />
        </Route>
    ));
};

const Tutorial: React.FC<TutorialProps> = (
    props: TutorialProps
): JSX.Element => {
    const matchEntry = (entry: ExerciseEntry): boolean => {
        return entry.route === props.route;
    };

    const exerciseEntry: ExerciseEntry | undefined = allExercises.find(
        matchEntry
    );

    if (exerciseEntry === undefined) {
        return <ErrorPage />;
    }

    const exerciseIndex = allExercises.findIndex(matchEntry);

    let nextButton: React.ReactElement | null = null;

    if (exerciseIndex < allExercises.length - 1) {
        const nextExercise = allExercises[exerciseIndex + 1];
        nextButton = (
            <Link to={nextExercise.route}>
                <Fab color="primary">
                    <PlayArrowIcon />
                </Fab>
            </Link>
        );
    }

    return (
        <Grid container data-testid="Tutorial">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    <exerciseEntry.component />
                    {nextButton}
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};
