import React, { useState } from "react";
import { Paper, Theme, withStyles } from "@material-ui/core";
import ChordPaperBody from "./ChordPaperBody";
import Header from "./Header";
import { ChordSong } from "../common/ChordModel";
import ChordPaperMenu from "./ChordPaperMenu";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        minHeight: "750px",
        width: "max-content",
    },
}))(Paper);

interface ChordPaperProps {
    initialSong: ChordSong;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    const [song, setSong] = useState<ChordSong>(props.initialSong);

    const songChangeHandler = (updatedSong: ChordSong) => {
        setSong(updatedSong.clone());
    };

    const loadHandler = (loadedSong: ChordSong) => {
        setSong(loadedSong.clone());
    };

    const newSongHandler = () => {
        setSong(new ChordSong());
    };

    return (
        <RootPaper elevation={3}>
            <Header
                data-testid={"Header"}
                song={song}
                onSongChanged={songChangeHandler}
            />
            <ChordPaperBody song={song} onSongChanged={songChangeHandler} />
            <ChordPaperMenu
                song={song}
                onLoad={loadHandler}
                onNewSong={newSongHandler}
            />
        </RootPaper>
    );
};

export default ChordPaper;
