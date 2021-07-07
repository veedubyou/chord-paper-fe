import React, { useState } from "react";
import { useCallback } from "react";
import { useReducer } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { ChordSongAction, useChordSongReducer } from "./reducer/reducer";
import { useCloud } from "./WithCloud";

interface OriginalComponentProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
    onSongChanged?: (song: ChordSong) => void;
}

export const withSongContext = <P extends OriginalComponentProps>(
    OriginalComponent: React.FC<P>
): React.FC<Omit<P, "songDispatch" | "onSongChanged">> => {
    return (props: Omit<P, "songDispatch" | "onSongChanged">): JSX.Element => {
        const [song, songDispatch] = useChordSongReducer(props.song);

        const handleSongChanged = useCallback((song: ChordSong) => {
            songDispatch({ type: "set-state", song: song });
        }, []);

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            songDispatch: songDispatch,
            onSongChanged: handleSongChanged,
        } as P;

        return <OriginalComponent {...originalComponentProps} />;
    };
};

export const withCloudSaveSongContext = <P extends OriginalComponentProps>(
    OriginalComponent: React.FC<P>
): React.FC<Omit<P, "songDispatch">> => {
    return (props: Omit<P, "songDispatch">): JSX.Element => {
        const [onSongChange, useSave] = useCloud();
        const [song, songDispatch] = useChordSongReducer(
            props.song,
            onSongChange
        );
        const unsavedPrompt = useSave(song);

        const handleSongChanged = useCallback((song: ChordSong) => {
            songDispatch({ type: "set-state", song: song });
        }, []);

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            songDispatch: songDispatch,
            onSongChanged: handleSongChanged,
        } as P;

        return (
            <>
                {unsavedPrompt}
                <OriginalComponent {...originalComponentProps} />
            </>
        );
    };
};
