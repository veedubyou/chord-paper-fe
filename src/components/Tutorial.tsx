import UnstyledPlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Fab as UnstyledFab, Paper, styled } from "@mui/material";
import { MultiFC, transformToFC } from "common/FunctionalComponent";
import { TutorialPath } from "common/paths";
import CenteredLayoutWithMenu from "components/display/CenteredLayoutWithMenu";
import ErrorPage from "components/display/ErrorPage";
import AddChord from "components/tutorial/AddChord";
import AddLine from "components/tutorial/AddLine";
import ChordPositioning from "components/tutorial/ChordPositioning";
import CopyAndPaste from "components/tutorial/CopyAndPaste";
import DragAndDropChord from "components/tutorial/DragAndDropChord";
import EditChord from "components/tutorial/EditChord";
import EditLyrics from "components/tutorial/EditLyrics";
import Instrumental from "components/tutorial/Instrumental";
import Labels from "components/tutorial/Labels";
import Login from "components/tutorial/Login";
import MergeLine from "components/tutorial/MergeLine";
import PasteLyrics from "components/tutorial/PasteLyrics";
import PlayMode from "components/tutorial/PlayMode";
import RemoveChord from "components/tutorial/RemoveChord";
import RemoveLine from "components/tutorial/RemoveLine";
import RemoveMultipleLines from "components/tutorial/RemoveMultipleLines";
import SplitLine from "components/tutorial/SplitLine";
import Starting from "components/tutorial/Start";
import TimeLabels from "components/tutorial/TimeLabels";
import TrackPlayer from "components/tutorial/TrackPlayer";
import { TutorialComponent } from "components/tutorial/TutorialComponent";
import React from "react";
import { Link, Route } from "react-router-dom";

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

const PlayArrowIcon = styled(UnstyledPlayArrowIcon)({
    color: "white",
});

const RootPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    padding: theme.spacing(5),
    minHeight: theme.spacing(46),
    width: theme.spacing(92),
    position: "relative",
}));

const Fab = styled(UnstyledFab)(({ theme }) => ({
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
}));

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
