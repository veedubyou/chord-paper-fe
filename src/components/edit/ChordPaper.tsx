import { Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "./ChordPaperBody";
import ChordPaperMenu from "./menu/ChordPaperMenu";
import Header from "./Header";
import { PlainFn } from "../../common/PlainFn";
import TrackPlayer from "../track_player/TrackPlayer";
import { makeStyles } from "@material-ui/styles";
import { Track } from "../../common/ChordModel/Track";
import PlayerTimeProvider from "../PlayerTimeContext";

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

    const trackChangeHandler = (trackList: Track[]) => {
        props.song.trackList = trackList;
        songChangeHandler(props.song);
    };

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
                <TrackPlayer
                    collapsedButtonClassName={whiteStyle.root}
                    trackList={props.song.trackList}
                    onTrackListChanged={trackChangeHandler}
                />
            </RootPaper>
        </PlayerTimeProvider>
    );
};

export default ChordPaper;
