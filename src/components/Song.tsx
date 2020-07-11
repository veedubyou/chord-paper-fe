import { Paper, Theme, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { ChordSong } from "../common/ChordModel/ChordSong";
import { useSnackbar } from "notistack";
import { loadSong, saveSong } from "../common/BrowserSave";
import { isLeft } from "fp-ts/lib/Either";
import { Route, Redirect } from "react-router-dom";
import ChordPaper from "./edit/ChordPaper";
import Play from "./play/Play";

interface SongProps {
    initialSong?: ChordSong;
    autoSaveAndLoad?: boolean;
}

const Song: React.FC<SongProps> = (props: SongProps): JSX.Element => {
    console.log("song rendered");

    const { enqueueSnackbar } = useSnackbar();

    const loadLastSavedSong = (): ChordSong | null => {
        const loadResults = loadSong();

        if (isLeft(loadResults)) {
            const msg =
                "Error loading previously auto saved song: " +
                loadResults.left.message;
            enqueueSnackbar(msg, { variant: "error" });
            return null;
        }

        if (loadResults.right === null) {
            return null;
        }

        enqueueSnackbar("Loaded last saved song", { variant: "success" });
        return loadResults.right;
    };

    const getInitialSong = (): ChordSong => {
        // if (props.initialSong !== undefined) {
        //     return props.initialSong;
        // }

        // if (props.autoSaveAndLoad) {
        //     const loadedSong = loadLastSavedSong();
        //     if (loadedSong === null) {
        //         return new ChordSong();
        //     }

        //     return loadedSong;
        // }

        return new ChordSong();
    };

    const [song, setSong] = useState<ChordSong>(new ChordSong());

    const handleSongChanged = (song: ChordSong) => {
        console.log("song changed");
        const updatedSong = song.clone();

        if (props.autoSaveAndLoad) {
            saveSong(updatedSong);
        }

        setSong(updatedSong);
    };

    return (
        <>
            <Route key="/song/edit" path="/song/edit">
                <ChordPaper song={song} onSongChanged={handleSongChanged} />
            </Route>
            <Route key="/song/play" path="/song/play">
                <Play song={song} />
            </Route>
        </>
    );
};

export default Song;
