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
        <RootPaper elevation={3} data-testid="ChordPaper">
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
