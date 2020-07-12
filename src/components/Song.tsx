import React, { useState } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ChordPaper from "./edit/ChordPaper";
import Play from "./play/Play";

export enum SongMode {
    Edit,
    Play,
}

interface SongProps {
    basePath: string;
    initialSong: ChordSong;
    mode: SongMode;
    onEdit?: () => void;
    onPlay?: () => void;
    onSongChanged?: (song: ChordSong) => void;
}

const Song: React.FC<SongProps> = (props: SongProps): JSX.Element => {
    const [song, setSong] = useState<ChordSong>(props.initialSong);

    const handleSongChanged = (song: ChordSong) => {
        const updatedSong = song.clone();
        props.onSongChanged?.(updatedSong);
        setSong(updatedSong);
    };

    if (props.mode === SongMode.Play) {
        return (
            <Play basePath={props.basePath} song={song} onEdit={props.onEdit} />
        );
    }

    return (
        <ChordPaper
            song={song}
            onSongChanged={handleSongChanged}
            onPlay={props.onPlay}
        />
    );
};

export default Song;
