import { Paper, Theme, withStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { TrackList } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";
import PlayerTimeProvider from "../PlayerTimeContext";
import TrackListProvider, {
    TrackListChangeHandler,
} from "../track_player/TrackListProvider";
import TrackPlayer from "../track_player/TrackPlayer";
import ChordPaperBody from "./ChordPaperBody";
import Header from "./Header";
import ChordPaperMenu from "./menu/ChordPaperMenu";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        position: "relative",
        margin: theme.spacing(5),
        minHeight: theme.spacing(92),
        minWidth: theme.spacing(92),
    },
}))(Paper);

const useWhiteStyle = makeStyles({
    root: {
        backgroundColor: "white",
    },
});

interface ChordPaperProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
    onPlay?: PlainFn;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    const whiteStyle = useWhiteStyle();

    const songChangeHandler = (song: ChordSong) => {
        props.onSongChanged?.(song);
    };

    const trackPlayer: React.ReactNode = (() => {
        if (props.song.isUnsaved()) {
            return null;
        }

        return (
            <TrackListProvider songID={props.song.id}>
                {(
                    tracklist: TrackList,
                    changeHandler: TrackListChangeHandler
                ) => (
                    <TrackPlayer
                        collapsedButtonClassName={whiteStyle.root}
                        timeSections={props.song.timeSections}
                        trackList={tracklist}
                        onTrackListChanged={changeHandler}
                    />
                )}
            </TrackListProvider>
        );
    })();

    return (
        <PlayerTimeProvider>
            <Helmet>
                <title>
                    {props.song.metadata.title !== ""
                        ? props.song.metadata.title
                        : "New Song"}
                </title>
            </Helmet>
            <RootPaper elevation={3} data-testid="ChordPaper">
                <Header
                    data-testid={"Header"}
                    song={props.song}
                    onSongChanged={songChangeHandler}
                />
                <ChordPaperBody
                    song={props.song}
                    onSongChanged={songChangeHandler}
                />
                <ChordPaperMenu
                    song={props.song}
                    onSongChanged={songChangeHandler}
                    onPlay={props.onPlay}
                />
                {trackPlayer}
            </RootPaper>
        </PlayerTimeProvider>
    );
};

export default ChordPaper;
