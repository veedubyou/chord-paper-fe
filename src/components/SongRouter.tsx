import React from "react";
import { Route, useHistory } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import Song, { SongMode } from "./Song";

interface SongRouterProps {
    basePath: string;
    initialSong: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

const SongRouter: React.FC<SongRouterProps> = (
    props: SongRouterProps
): JSX.Element => {
    const history = useHistory();

    const editPath = `${props.basePath}/edit`;
    const playPath = `${props.basePath}/play`;

    const switchToEdit = () => {
        history.push(editPath);
    };

    const switchToPlay = () => {
        history.push(playPath);
    };

    return (
        <>
            <Route key={editPath} path={editPath}>
                <Song
                    initialSong={props.initialSong}
                    mode={SongMode.Edit}
                    onSongChanged={props.onSongChanged}
                    onEdit={switchToEdit}
                    onPlay={switchToPlay}
                />
            </Route>
            <Route key={playPath} path={playPath}>
                <Song
                    initialSong={props.initialSong}
                    mode={SongMode.Play}
                    onSongChanged={props.onSongChanged}
                    onEdit={switchToEdit}
                    onPlay={switchToPlay}
                />
            </Route>
        </>
    );
};

export default SongRouter;