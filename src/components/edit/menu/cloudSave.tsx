import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";
import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useErrorSnackbar } from "../../../common/backend/errors";
import { createSong, deleteSong } from "../../../common/backend/requests";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { SongPath } from "../../../common/paths";
import { noopFn, PlainFn } from "../../../common/PlainFn";
import { User } from "../../user/userContext";

export const useCloudCreateSong = () => {
    const { enqueueSnackbar } = useSnackbar();
    const showError = useErrorSnackbar();
    const history = useHistory();

    const createNewSong = async (song: ChordSong, user: User) => {
        const ownedSong = song.set("owner", user.userID);

        const createResult = await createSong(ownedSong, user.authToken);

        if (isLeft(createResult)) {
            await showError(createResult.left);
            return;
        }

        let deserializeResult = ChordSong.fromJSONObject(createResult.right);

        if (isLeft(deserializeResult)) {
            console.error("Backend response does not match song format");
            console.log(createResult.right);
            enqueueSnackbar(
                "A failure happened. Check console for more error details",
                { variant: "error" }
            );
            return;
        }

        const deserializedSong = deserializeResult.right;
        const pathWithID = SongPath.root.withID(deserializedSong.id);
        const editPath = pathWithID.withEditMode();

        history.push(editPath.URL());
    };

    return async (song: ChordSong, user: User) => {
        if (song.isUnsaved()) {
            await createNewSong(song, user);
        }
    };
};

export const useCloudDeleteSongDialog = (
    song: ChordSong,
    user: User | null
): [PlainFn, React.ReactElement | null] => {
    const { enqueueSnackbar } = useSnackbar();
    const showError = useErrorSnackbar();
    const history = useHistory();
    const [shouldShowDialog, setShouldShowDialog] = useState(false);

    const showDialog = () => setShouldShowDialog(true);

    if (!shouldShowDialog) {
        return [showDialog, null];
    }

    if (user === null) {
        return [noopFn, null];
    }

    if (user === null) {
        return [noopFn, null];
    }

    const closeDialog = () => setShouldShowDialog(false);

    const deleteAction = async () => {
        if (song.isUnsaved()) {
            return;
        }

        const deleteResult = await deleteSong(song, user.authToken);

        if (isLeft(deleteResult)) {
            await showError(deleteResult.left);
            return;
        }

        enqueueSnackbar("Song has been successfully deleted", {
            variant: "success",
        });
        history.push(SongPath.newURL());
    };

    const deleteDialog = (
        <Dialog open onClose={closeDialog}>
            <DialogTitle>Delete Song</DialogTitle>
            <DialogContent>
                <Typography>
                    This will delete the song and cannot be undone. Are you
                    sure?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={deleteAction}>Delete</Button>
            </DialogActions>
        </Dialog>
    );

    return [noopFn, deleteDialog];
};
