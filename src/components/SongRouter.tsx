import React from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "../common/FunctionalComponent";
import ChordPaper from "./edit/ChordPaper";
import { DemoPath, SongIDPath } from "../common/paths";
import Play from "./play/Play";

interface SongRouterProps {
    path: SongIDPath | DemoPath;
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

const SongRouter: MultiFC<SongRouterProps> = (
    props: SongRouterProps
): JSX.Element[] => {
    const history = useHistory();

    const editPath = props.path.withMode("edit");
    const playPath = props.path.withMode("play");

    const switchToEdit = () => {
        history.push(editPath.URL());
    };

    const switchToPlay = () => {
        history.push(playPath.URL());
    };

    return [
        <Redirect
            key={props.path.URL()}
            from={props.path.URL()}
            to={editPath.URL()}
            exact
        />,
        <Route key={editPath.URL()} path={editPath.URL()}>
            <ChordPaper
                song={props.song}
                onSongChanged={props.onSongChanged}
                onPlay={switchToPlay}
            />
        </Route>,
        <Route key={playPath.URL()} path={playPath.URL()}>
            <Play song={props.song} onEdit={switchToEdit} />
        </Route>,
    ];
};

export default transformToFC(SongRouter);
