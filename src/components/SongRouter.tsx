import React from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "../common/FunctionalComponent";
import ChordPaper from "./edit/ChordPaper";
import Play from "./play/Play";

interface SongRouterProps {
    basePath: string;
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

const SongRouter: MultiFC<SongRouterProps> = (
    props: SongRouterProps
): JSX.Element[] => {
    const history = useHistory();

    const editPath = `${props.basePath}/edit`;
    const playPath = `${props.basePath}/play`;

    const switchToEdit = () => {
        history.push(editPath);
    };

    const switchToPlay = () => {
        history.push(playPath);
    };

    return [
        <Redirect
            key="redirect-base"
            from={props.basePath}
            to={editPath}
            exact
        />,
        <Route key={editPath} path={editPath}>
            <ChordPaper
                song={props.song}
                onSongChanged={props.onSongChanged}
                onPlay={switchToPlay}
            />
        </Route>,
        <Route key={playPath} path={playPath}>
            <Play song={props.song} onEdit={switchToEdit} />
        </Route>,
    ];
};

export default transformToFC(SongRouter);
