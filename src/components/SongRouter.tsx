import { ChordSong } from "common/ChordModel/ChordSong";
import { MultiFC, transformToFC } from "common/FunctionalComponent";
import { SongIDPath } from "common/paths";
import ChordPaperScreen from "components/edit/ChordPaper";
import PlayRoutes from "components/play/Play";
import { ChordSongAction } from "components/reducer/reducer";
import React from "react";
import { Redirect, Route, useHistory } from "react-router-dom";

interface SongRouterProps {
    path: SongIDPath;
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
}

const SongRouter: MultiFC<SongRouterProps> = (
    props: SongRouterProps
): JSX.Element[] => {
    const history = useHistory();

    const editPath = props.path.withEditMode();
    const playPath = props.path.withPlayMode();

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
            <ChordPaperScreen
                song={props.song}
                songDispatch={props.songDispatch}
                onPlay={switchToPlay}
            />
        </Route>,
        <Route key={playPath.URL()} path={playPath.URL()}>
            <PlayRoutes
                song={props.song}
                onEditMode={switchToEdit}
                path={playPath}
            />
        </Route>,
    ];
};

export default transformToFC(SongRouter);
