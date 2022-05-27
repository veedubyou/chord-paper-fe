import React from "react";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, useHistory } from "react-router-dom";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "../../common/FunctionalComponent";
import { PlaySongPath } from "../../common/paths";
import { PlainFn } from "../../common/PlainFn";
import CenteredLayout from "../display/CenteredLayout";
import LoadingRender from "../loading/LoadingRender";
import JamStation from "../track_player/JamStation";
import TrackListProvider, {
    TrackListChangeHandler,
    TrackListLoad,
} from "../track_player/providers/TrackListProvider";
import PagePlayView from "./page/PagePlayView";
import ScrollPlayView from "./scroll/ScrollPlayView";

interface PlayProps {
    song: ChordSong;
    onEditMode?: PlainFn;
    path: PlaySongPath;
}

interface PlayScreenProps {
    children: React.ReactElement;
    song: ChordSong;
}

const PlayScreen: React.FC<PlayScreenProps> = (
    props: PlayScreenProps
): JSX.Element => {
    const trackPlayer: React.ReactNode = (() => {
        if (props.song.isUnsaved()) {
            return null;
        }

        return (
            <TrackListProvider song={props.song}>
                {(
                    tracklistLoad: TrackListLoad,
                    onRefresh: PlainFn,
                    onChange: TrackListChangeHandler
                ) => (
                    <JamStation
                        collapsedButtonSx={{
                            backgroundColor: "transparent",
                        }}
                        timeSections={props.song.timeSections}
                        tracklistLoad={tracklistLoad}
                        onTrackListChanged={onChange}
                        onRefresh={onRefresh}
                    />
                )}
            </TrackListProvider>
        );
    })();

    return (
        <LoadingRender>
            <CenteredLayout>
                <Helmet>
                    <title>
                        {props.song.metadata.title !== ""
                            ? props.song.metadata.title
                            : "New Song"}
                    </title>
                </Helmet>
                {props.children}
                {trackPlayer}
            </CenteredLayout>
        </LoadingRender>
    );
};

const PlayRoutes: MultiFC<PlayProps> = (props: PlayProps): JSX.Element[] => {
    const history = useHistory();

    const pageViewPath = props.path.withPageView();
    const scrollViewPath = props.path.withScrollView();

    const switchToPageView = () => history.push(pageViewPath.URL());
    const switchToScrollView = () => history.push(scrollViewPath.URL());

    return [
        <Route key={props.path.URL()} path={props.path.URL()} exact>
            <Redirect to={pageViewPath.URL()} />,
        </Route>,
        <Route key={pageViewPath.URL()} path={pageViewPath.URL()}>
            <PlayScreen song={props.song}>
                <PagePlayView
                    song={props.song}
                    onScrollView={switchToScrollView}
                    onEditMode={props.onEditMode}
                />
            </PlayScreen>
        </Route>,
        <Route key={scrollViewPath.URL()} path={scrollViewPath.URL()}>
            <PlayScreen song={props.song}>
                <ScrollPlayView
                    song={props.song}
                    onPageView={switchToPageView}
                    onEditMode={props.onEditMode}
                />
            </PlayScreen>
        </Route>,
    ];
};

export default transformToFC(PlayRoutes);
