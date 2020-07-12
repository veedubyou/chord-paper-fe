import React, { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ChordPaper from "./edit/ChordPaper";
import Play from "./play/Play";

interface SongProps {
    basePath: string;
    initialSong: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

const Song: React.FC<SongProps> = (props: SongProps): JSX.Element => {
    const [song, setSong] = useState<ChordSong>(props.initialSong);
    const history = useHistory();

    const handleSongChanged = (song: ChordSong) => {
        const updatedSong = song.clone();
        props.onSongChanged?.(updatedSong);
        setSong(updatedSong);
    };

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
                <ChordPaper
                    song={song}
                    onSongChanged={handleSongChanged}
                    onPlay={switchToPlay}
                />
            </Route>
            <Route key={playPath} path={playPath}>
                <Play
                    basePath={props.basePath}
                    song={song}
                    onEdit={switchToEdit}
                />
            </Route>
        </>
    );
};

export default Song;
