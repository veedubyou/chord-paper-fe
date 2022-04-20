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
import Login from "./tutorial/Login";
import RemoveMultipleLines from "./tutorial/RemoveMultipleLines";
import TrackPlayer from "./tutorial/TrackPlayer";
import TimeLabels from "./tutorial/TimeLabels";
import { TutorialComponent } from "./tutorial/TutorialComponent";

type ExerciseEntry = {
    route: string;
    component: TutorialComponent;
};

export type ExerciseRoute = {
    title: string;
    route: string;
};

const allExercises: ExerciseEntry[] = [
    {
        route: "/learn/start",
        component: Starting,
    },
    {
        route: "/learn/edit-chord",
        component: EditChord,
    },
    {
        route: "/learn/remove-chord",
        component: RemoveChord,
    },
    {
        route: "/learn/add-chord",
        component: AddChord,
    },
    {
        route: "/learn/drag-and-drop-chord",
        component: DragAndDropChord,
    },
    {
        route: "/learn/edit-lyrics",
        component: EditLyrics,
    },
    {
        route: "/learn/instrumentals",
        component: Instrumental,
    },
    {
        route: "/learn/chord-positioning",
        component: ChordPositioning,
    },
    {
        route: "/learn/add-line",
        component: AddLine,
    },
    {
        route: "/learn/remove-line",
        component: RemoveLine,
    },
    {
        route: "/learn/paste-lyrics",
        component: PasteLyrics,
    },
    {
        route: "/learn/remove-multiple-lines",
        component: RemoveMultipleLines,
    },
    {
        route: "/learn/merge-lines",
        component: MergeLine,
    },
    {
        route: "/learn/split-lines",
        component: SplitLine,
    },
    {
        route: "/learn/copy-and-paste",
        component: CopyAndPaste,
    },
    {
        route: "/learn/labels",
        component: Labels,
    },
    {
        route: "/learn/time-labels",
        component: TimeLabels,
    },
    {
        route: "/learn/play-mode",
        component: PlayMode,
    },
    {
        route: "/learn/login",
        component: Login,
    },
    {
        route: "/learn/track-player",
        component: TrackPlayer,
    },
];

export const allExerciseRoutes = (): ExerciseRoute[] => {
    return allExercises.map((entry: ExerciseEntry) => ({
        title: entry.component.title,
        route: entry.route,
    }));
};

export const getRouteForTutorialComponent = (
    tutorialComponent: TutorialComponent
): string => {
    const matchingExercise: ExerciseEntry | undefined = allExercises.find(
        (exercise: ExerciseEntry) =>
            exercise.component.title === tutorialComponent.title
    );

    if (matchingExercise === undefined) {
        throw new Error(
            "Input tutorial component not found in list - is the list up to date?"
        );
    }

    return matchingExercise.route;
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
