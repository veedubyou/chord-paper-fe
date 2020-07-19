import React, { useState } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";

interface SongProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

export const withSongContext = <P extends SongProps>(
    OriginalComponent: React.FC<P>
): React.FC<P> => {
    return (props: P): JSX.Element => {
        const [song, setSong] = useState<ChordSong>(props.song);

        const handleSongChanged = (song: ChordSong) => {
            setSong(song.clone());
            props.onSongChanged?.(song);
        };

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            onSongChanged: handleSongChanged,
        } as P;

        return <OriginalComponent {...originalComponentProps} />;
    };
};
