import { ChordSong } from "common/ChordModel/ChordSong";
import { ChordSongAction, useChordSongReducer } from "components/reducer/reducer";
import { useCloud } from "components/useCloud";
import React from "react";

interface OriginalComponentProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
}

export const withSongContext = <P extends OriginalComponentProps>(
    OriginalComponent: React.FC<P>
): React.FC<Omit<P, "songDispatch">> => {
    return (props: Omit<P, "songDispatch">): JSX.Element => {
        const [song, songDispatch] = useChordSongReducer(props.song);

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            songDispatch: songDispatch,
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
        const unsavedPrompt = useSave(song, songDispatch);

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            songDispatch: songDispatch,
        } as P;

        return (
            <>
                {unsavedPrompt}
                <OriginalComponent {...originalComponentProps} />
            </>
        );
    };
};
