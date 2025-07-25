import { ChordSong } from "common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "common/FunctionalComponent";
import { PlaySongPath } from "common/paths";
import { PlainFn } from "common/PlainFn";
import CenteredLayout from "components/display/CenteredLayout";
import LoadingRender from "components/loading/LoadingRender";
import PagePlayView from "components/play/page/PagePlayView";
import ScrollPlayView from "components/play/scroll/ScrollPlayView";
import PlayerSectionProvider from "components/PlayerSectionContext";
import PlayerTimeProvider from "components/PlayerTimeContext";
import JamStation from "components/track_player/JamStation";
import TrackListProvider, {
    TrackListChangeHandler,
    TrackListLoad,
} from "components/track_player/providers/TrackListProvider";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, useHistory } from "react-router-dom";

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
                        timestampedSections={props.song.timestampedSections}
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
                <PlayerTimeProvider>
                    <PlayerSectionProvider song={props.song}>
                        <Helmet>
                            <title>
                                {props.song.metadata.title !== ""
                                    ? props.song.metadata.title
                                    : "New Song"}
                            </title>
                        </Helmet>
                        {props.children}
                        {trackPlayer}
                    </PlayerSectionProvider>
                </PlayerTimeProvider>
            </CenteredLayout>
        </LoadingRender>
    );
};

const PlayRoutes: MultiFC<PlayProps> = (props: PlayProps): JSX.Element[] => {
    const history = useHistory();

    const pageViewPath = props.path.withPageView();
    const scrollViewPath = props.path.withScrollView();
    const playerViewPath = props.path.withPlayerView();

    const switchToPageView = () => history.push(pageViewPath.URL());
    const switchToScrollView = () => history.push(scrollViewPath.URL());

    return [
        <Route key={props.path.URL()} path={props.path.URL()} exact>
            <Redirect to={scrollViewPath.URL()} />,
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
        <Route key={playerViewPath.URL()} path={playerViewPath.URL()}>
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
                        fullScreen={true}
                        timestampedSections={props.song.timestampedSections}
                        tracklistLoad={tracklistLoad}
                        onTrackListChanged={onChange}
                        onRefresh={onRefresh}
                    />
                )}
            </TrackListProvider>
        </Route>,
    ];
};

export default transformToFC(PlayRoutes);
