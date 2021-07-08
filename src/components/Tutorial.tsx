import { Fab as UnstyledFab, Paper, Theme } from "@material-ui/core";
import UnstyledPlayArrowIcon from "@material-ui/icons/PlayArrow";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link, Route } from "react-router-dom";
import ErrorPage from "./display/ErrorPage";
import AddChord from "./tutorial/AddChord";
import AddLine from "./tutorial/AddLine";
import ChordPositioning from "./tutorial/ChordPositioning";
import CopyAndPaste from "./tutorial/CopyAndPaste";
import DragAndDropChord from "./tutorial/DragAndDropChord";
import EditChord from "./tutorial/EditChord";
import EditLyrics from "./tutorial/EditLyrics";
import Instrumental from "./tutorial/Instrumental";
import MergeLine from "./tutorial/MergeLine";
import PasteLyrics from "./tutorial/PasteLyrics";
import RemoveChord from "./tutorial/RemoveChord";
import RemoveLine from "./tutorial/RemoveLine";
import Starting from "./tutorial/Start";
import Labels from "./tutorial/Labels";
import PlayMode from "./tutorial/PlayMode";
import SplitLine from "./tutorial/SplitLine";
import Saving from "./tutorial/Saving";

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
        title: "Drag and Drop Chords",
        route: "/learn/drag_and_drop_chord",
        component: DragAndDropChord,
    },
    {
        title: "Edit Lyrics",
        route: "/learn/edit_lyrics",
        component: EditLyrics,
    },
    {
        title: "Instrumentals",
        route: "/learn/instrumentals",
        component: Instrumental,
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
    {
        title: "Splitting Lines",
        route: "/learn/split_lines",
        component: SplitLine,
    },
    {
        title: "Copying and Pasting Lines",
        route: "/learn/copy_and_paste",
        component: CopyAndPaste,
    },
    {
        title: "Labels",
        route: "/learn/labels",
        component: Labels,
    },
    {
        title: "Play Mode",
        route: "/learn/play_mode",
        component: PlayMode,
    },
    {
        title: "Saving and Loading",
        route: "/learn/saving",
        component: Saving,
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
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        width: theme.spacing(92),
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

interface TutorialProps {
    route: string;
}

type WrapperFn = (child: React.ReactElement) => React.ReactElement;

export const TutorialSwitches = (
    wrapperFn: WrapperFn
): React.ReactElement[] => {
    return allExercises.map((exerciseEntry: ExerciseEntry) => (
        <Route key={exerciseEntry.route} exact path={exerciseEntry.route}>
            {wrapperFn(<Tutorial route={exerciseEntry.route} />)}
        </Route>
    ));
};

const Tutorial: React.FC<TutorialProps> = (
    props: TutorialProps
): JSX.Element => {
    const matchEntry = (entry: ExerciseEntry): boolean => {
        return entry.route === props.route;
    };

    const exerciseEntry: ExerciseEntry | undefined =
        allExercises.find(matchEntry);

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
        <RootPaper>
            <exerciseEntry.component />
            {nextButton}
        </RootPaper>
    );
};
