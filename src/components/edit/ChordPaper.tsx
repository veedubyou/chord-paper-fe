import { Paper, Theme, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "./ChordPaperBody";
import ChordPaperMenu from "./ChordPaperMenu";
import Header from "./Header";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        minHeight: theme.spacing(92),
        minWidth: theme.spacing(92),
    },
}))(Paper);

interface ChordPaperProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    const songChangeHandler = (song: ChordSong) => {
        props.onSongChanged?.(song);
    };

    const loadHandler = (loadedSong: ChordSong) => {
        props.onSongChanged?.(loadedSong);
    };

    const newSongHandler = () => {
        props.onSongChanged?.(new ChordSong());
    };

    return (
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
                onLoad={loadHandler}
                onNewSong={newSongHandler}
            />
        </RootPaper>
    );
};

export default ChordPaper;
