import React from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import {
    ChordSongAction,
    RemovingLines,
    useChordSongReducer,
} from "./reducer/reducer";
import { useCloud } from "./useCloud";

interface BaseOriginalComponentProps {
    song: ChordSong;
    removingLines: RemovingLines;
    songDispatch: React.Dispatch<ChordSongAction>;
}

type WrappedComponentProps<P extends BaseOriginalComponentProps> = Omit<
    P,
    "removingLines" | "songDispatch"
>;

export const withSongContext = <P extends BaseOriginalComponentProps>(
    OriginalComponent: React.FC<P>
): React.FC<WrappedComponentProps<P>> => {
    return (props: WrappedComponentProps<P>): JSX.Element => {
        const [{ song, removingLines }, songDispatch] = useChordSongReducer(
            props.song
        );

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            removingLines: removingLines,
            songDispatch: songDispatch,
        } as P;

        return <OriginalComponent {...originalComponentProps} />;
    };
};

export const withCloudSaveSongContext = <P extends BaseOriginalComponentProps>(
    OriginalComponent: React.FC<P>
): React.FC<WrappedComponentProps<P>> => {
    return (props: WrappedComponentProps<P>): JSX.Element => {
        const [onSongChange, useSave] = useCloud();
        const [{ song, removingLines }, songDispatch] = useChordSongReducer(
            props.song,
            onSongChange
        );
        const unsavedPrompt = useSave(song, songDispatch);

        const { song: throwawaySong, ...propsWithoutInitialSong } = props;

        // https://github.com/microsoft/TypeScript/issues/35858
        const originalComponentProps = {
            ...propsWithoutInitialSong,
            song: song,
            removingLines: removingLines,
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
