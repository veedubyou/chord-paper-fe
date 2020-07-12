import { Backdrop, CircularProgress, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import { isLeft } from "fp-ts/lib/Either";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { loadSong, saveSong } from "../common/BrowserSave";
import { ChordSong } from "../common/ChordModel/ChordSong";
import Song from "./Song";

const useBackdropStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: "#fff",
        },
    })
);

interface AutoSaveSongProps {
    basePath: string;
}

const AutoSaveSong: React.FC<AutoSaveSongProps> = (
    props: AutoSaveSongProps
): JSX.Element => {
    const [loadedSong, setLoadedSong] = useState<ChordSong | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const backdropStyles = useBackdropStyles();

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

    const handleSongChanged = (song: ChordSong) => {
        saveSong(song);
    };

    if (loadedSong === null) {
        setLoadedSong(loadLastSavedSong());
        return (
            <Backdrop className={backdropStyles.backdrop} open>
                <CircularProgress />
            </Backdrop>
        );
    }

    return (
        <Song
            basePath={props.basePath}
            initialSong={loadedSong}
            onSongChanged={handleSongChanged}
        />
    );
};

export default AutoSaveSong;
