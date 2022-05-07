import { Fab as UnstyledFab, Paper, Theme } from "@material-ui/core";
import UnstyledPlayArrowIcon from "@material-ui/icons/PlayArrow";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { Link, Route } from "react-router-dom";
import { MultiFC, transformToFC } from "../common/FunctionalComponent";
import { TutorialPath } from "../common/paths";
import CenteredLayoutWithMenu from "./display/CenteredLayoutWithMenu";
import ErrorPage from "./display/ErrorPage";
import AddChord from "./tutorial/AddChord";
import AddLine from "./tutorial/AddLine";
import ChordPositioning from "./tutorial/ChordPositioning";
import CopyAndPaste from "./tutorial/CopyAndPaste";
import DragAndDropChord from "./tutorial/DragAndDropChord";
import EditChord from "./tutorial/EditChord";
import EditLyrics from "./tutorial/EditLyrics";
import Instrumental from "./tutorial/Instrumental";
import Labels from "./tutorial/Labels";
import Login from "./tutorial/Login";
import MergeLine from "./tutorial/MergeLine";
import PasteLyrics from "./tutorial/PasteLyrics";
import PlayMode from "./tutorial/PlayMode";
import RemoveChord from "./tutorial/RemoveChord";
import RemoveLine from "./tutorial/RemoveLine";
import RemoveMultipleLines from "./tutorial/RemoveMultipleLines";
import SplitLine from "./tutorial/SplitLine";
import Starting from "./tutorial/Start";
import TimeLabels from "./tutorial/TimeLabels";
import TrackPlayer from "./tutorial/TrackPlayer";
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
        route: new TutorialPath("start").URL(),
        component: Starting,
    },
    {
        route: new TutorialPath("edit-chord").URL(),
        component: EditChord,
    },
    {
        route: new TutorialPath("remove-chord").URL(),
        component: RemoveChord,
    },
    {
        route: new TutorialPath("add-chord").URL(),
        component: AddChord,
    },
    {
        route: new TutorialPath("drag-and-drop-chord").URL(),
        component: DragAndDropChord,
    },
    {
        route: new TutorialPath("edit-lyrics").URL(),
        component: EditLyrics,
    },
    {
        route: new TutorialPath("instrumentals").URL(),
        component: Instrumental,
    },
    {
        route: new TutorialPath("chord-positioning").URL(),
        component: ChordPositioning,
    },
    {
        route: new TutorialPath("add-line").URL(),
        component: AddLine,
    },
    {
        route: new TutorialPath("remove-line").URL(),
        component: RemoveLine,
    },
    {
        route: new TutorialPath("paste-lyrics").URL(),
        component: PasteLyrics,
    },
    {
        route: new TutorialPath("remove-multiple-lines").URL(),
        component: RemoveMultipleLines,
    },
    {
        route: new TutorialPath("merge-lines").URL(),
        component: MergeLine,
    },
    {
        route: new TutorialPath("split-lines").URL(),
        component: SplitLine,
    },
    {
        route: new TutorialPath("copy-and-paste").URL(),
        component: CopyAndPaste,
    },
    {
        route: new TutorialPath("labels").URL(),
        component: Labels,
    },
    {
        route: new TutorialPath("time-labels").URL(),
        component: TimeLabels,
    },
    {
        route: new TutorialPath("play-mode").URL(),

        component: PlayMode,
    },
    {
        route: new TutorialPath("login").URL(),

        component: Login,
    },
    {
        route: new TutorialPath("track-player").URL(),
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

interface SingleTutorialProps {
    route: string;
}

const SingleTutorialScreen: React.FC<SingleTutorialProps> = (
    props: SingleTutorialProps
): JSX.Element => {
    return (
        <CenteredLayoutWithMenu>
            <SingleTutorial route={props.route} />
        </CenteredLayoutWithMenu>
    );
};

const SingleTutorial: React.FC<SingleTutorialProps> = (
    props: SingleTutorialProps
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

const TutorialRoutes: MultiFC<{}> = (): React.ReactElement[] => {
    return allExercises.map((exerciseEntry: ExerciseEntry) => (
        <Route key={exerciseEntry.route} path={exerciseEntry.route} exact>
            <SingleTutorialScreen route={exerciseEntry.route} />
        </Route>
    ));
};

export default transformToFC(TutorialRoutes);
