import React, { useState } from "react";
import { useCallback } from "react";
import { useReducer } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { useChordSongReducer } from "./reducer/reducer";

interface SongProps {
    song: ChordSong;
    onSongChanged: (song: ChordSong) => void;
}

export const withSongContext = <P extends SongProps>(
    OriginalComponent: React.FC<P>
): React.FC<P> => {
    return (props: P): JSX.Element => {
        const [song, dispatch] = useChordSongReducer(
            props.song,
            props.onSongChanged
        );

        const handleSongChanged = useCallback((song: ChordSong) => {
            dispatch({ type: "set-state", song: song });
        }, []);

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
