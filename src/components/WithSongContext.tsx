import React, { useState } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";

interface SongProps {
    song: ChordSong;
    onSongChanged?: (song: ChordSong) => void;
}

interface InitialSong {
    song: ChordSong;
}

type PropsWithoutSong<P extends SongProps> = Omit<P, keyof SongProps>;
type HOCProps<P extends SongProps> = PropsWithoutSong<P> & InitialSong;

export const withSongContext = <P extends SongProps>(
    OriginalComponent: React.FC<P>
): React.FC<HOCProps<P>> => {
    return (props: HOCProps<P>): JSX.Element => {
        const [song, setSong] = useState<ChordSong>(props.song);

        const handleSongChanged = (song: ChordSong) => {
            setSong(song.clone());
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
