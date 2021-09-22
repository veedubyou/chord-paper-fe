import React from "react";
import { Redirect, Route, useHistory } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "../common/FunctionalComponent";
import { SongIDPath } from "../common/paths";
import ChordPaper from "./edit/ChordPaper";
import Play from "./play/Play";
import { ChordSongAction } from "./reducer/reducer";

interface SongRouterProps {
    path: SongIDPath;
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
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
        <Route key={props.path.URL()} path={props.path.URL()} exact>
            <Redirect to={editPath.URL()} />,
        </Route>,
        <Route key={editPath.URL()} path={editPath.URL()}>
            <ChordPaper
                song={props.song}
                songDispatch={props.songDispatch}
                onPlay={switchToPlay}
            />
        </Route>,
        <Route key={playPath.URL()} path={playPath.URL()}>
            <Play song={props.song} onEdit={switchToEdit} />
        </Route>,
    ];
};

export default transformToFC(SongRouter);
