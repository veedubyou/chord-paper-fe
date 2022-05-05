import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Redirect, Route, useHistory } from "react-router-dom";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "../../common/FunctionalComponent";
import { PlaySongPath } from "../../common/paths";
import { PlainFn } from "../../common/PlainFn";
import JamStation from "../track_player/JamStation";
import TrackListProvider, {
    TrackListChangeHandler,
    TrackListLoad,
} from "../track_player/providers/TrackListProvider";
import PagePlayView from "./page/PagePlayView";
import ScrollPlayView from "./scroll/ScrollPlayView";

const useTransparentStyle = makeStyles({
    root: {
        backgroundColor: "transparent",
    },
});

interface PlayProps {
    song: ChordSong;
    onEditMode?: PlainFn;
    path: PlaySongPath;
}

const Play: MultiFC<PlayProps> = (props: PlayProps): JSX.Element[] => {
    const history = useHistory();

    const pageViewPath = props.path.withPageView();
    const scrollViewPath = props.path.withScrollView();

    const transparentStyle = useTransparentStyle();

    const switchToPageView = () => history.push(pageViewPath.URL());
    const switchToScrollView = () => history.push(scrollViewPath.URL());

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
                        collapsedButtonClassName={transparentStyle.root}
                        timeSections={props.song.timeSections}
                        tracklistLoad={tracklistLoad}
                        onTrackListChanged={onChange}
                        onRefresh={onRefresh}
                    />
                )}
            </TrackListProvider>
        );
    })();

    const contentsWithView = (
        playView: React.ReactElement
    ): React.ReactElement => {
        return (
            <>
                <Helmet>
                    <title>
                        {props.song.metadata.title !== ""
                            ? props.song.metadata.title
                            : "New Song"}
                    </title>
                </Helmet>
                {playView}
                {trackPlayer}
            </>
        );
    };

    return [
        <Route key={props.path.URL()} path={props.path.URL()} exact>
            <Redirect to={pageViewPath.URL()} />,
        </Route>,
        <Route key={pageViewPath.URL()} path={pageViewPath.URL()}>
            {contentsWithView(
                <PagePlayView
                    song={props.song}
                    onScrollView={switchToScrollView}
                    onEditMode={props.onEditMode}
                />
            )}
        </Route>,
        <Route key={scrollViewPath.URL()} path={scrollViewPath.URL()}>
            {contentsWithView(
                <ScrollPlayView
                    song={props.song}
                    onPageView={switchToPageView}
                    onEditMode={props.onEditMode}
                />
            )}
        </Route>,
    ];
};

export default transformToFC(Play);
