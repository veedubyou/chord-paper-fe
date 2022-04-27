import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
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
}

type ViewTypes = "page" | "scroll";

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const [view, setView] = useState<ViewTypes>("page");
    const transparentStyle = useTransparentStyle();

    const switchToScrollView = () => setView("scroll");
    const switchToPageView = () => setView("page");

    const playView: React.ReactElement = (() => {
        switch (view) {
            case "page": {
                return (
                    <PagePlayView
                        song={props.song}
                        onScrollView={switchToScrollView}
                        onEditMode={props.onEditMode}
                    />
                );
            }

            case "scroll": {
                return (
                    <ScrollPlayView
                        song={props.song}
                        onPageView={switchToPageView}
                        onEditMode={props.onEditMode}
                    />
                );
            }
        }
    })();

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

export default Play;
