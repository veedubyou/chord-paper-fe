import { Paper, Theme, withStyles } from "@material-ui/core";
import React, { useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "./ChordPaperBody";
import ChordPaperMenu from "./ChordPaperMenu";
import Header from "./Header";
import { loadSong, saveSong } from "../../common/BrowserSave";
import ChordPaper from "./ChordPaper";
import { isLeft } from "fp-ts/lib/Either";
import { useSnackbar } from "notistack";

const AutoSaveChordPaper: React.FC<{}> = (): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();

    const loadLastSavedSong = (): ChordSong => {
        const loadResults = loadSong();

        if (isLeft(loadResults)) {
            const msg =
                "Error loading previously auto saved song: " +
                loadResults.left.message;
            enqueueSnackbar(msg, { variant: "error" });
            return new ChordSong();
        }

        if (loadResults.right === null) {
            return new ChordSong();
        }

        enqueueSnackbar("Loaded last saved song", { variant: "success" });
        return loadResults.right;
    };

    const song = loadLastSavedSong();

    const handleSongChanged = (song: ChordSong) => {
        saveSong(song);
    };

    return <ChordPaper initialSong={song} onSongChanged={handleSongChanged} />;
};

export default AutoSaveChordPaper;
