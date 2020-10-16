import { Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "./ChordPaperBody";
import ChordPaperMenu from "./menu/ChordPaperMenu";
import Header from "./Header";
import { PlainFn } from "../../common/PlainFn";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        position: "relative",
        margin: theme.spacing(5),
        minHeight: theme.spacing(92),
        minWidth: theme.spacing(92),
    },
}))(Paper);

interface ChordPaperProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
    onPlay?: PlainFn;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    const songChangeHandler = (song: ChordSong) => {
        props.onSongChanged?.(song);
    };

    return (
        <>
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
            </RootPaper>
        </>
    );
};

export default ChordPaper;
