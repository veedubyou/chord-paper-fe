import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React from "react";
import { useHistory } from "react-router-dom";
import { createSong, updateSong } from "../../../common/backend";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { songPath } from "../../../common/paths";
import { User, UserContext } from "../../user/userContext";

export const useCloudSaveAction = (song: ChordSong) => {
    const user = React.useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const createNewSong = async (user: User) => {
        song.owner = user.user_id;

        const createResult = await createSong(song, user.google_auth_token);

        if (isLeft(createResult)) {
            console.error(
                "Failed to make create song request to BE",
                createResult.left
            );
            enqueueSnackbar(
                "Failed to save song to backend. Check console for more error details",
                { variant: "error" }
            );

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

        song.id = deserializeResult.right.id;
        //TODO: this code is super fucked, but this will all go away soon
        // when auto save happens
        history.push(songPath.withID(song.id).withMode("edit").URL());
    };

    const updateExistingSong = async (user: User) => {
        const updateResult = await updateSong(song, user.google_auth_token);

        if (isLeft(updateResult)) {
            console.error(
                "Failed to make update song request to BE",
                updateResult.left
            );
            enqueueSnackbar(
                "Failed to save song to backend. Check console for more error details",
                { variant: "error" }
            );

            return;
        }
    };

    return async () => {
        if (user === null) {
            enqueueSnackbar("You must log in to save your song", {
                variant: "error",
            });
            return;
        }

        if (song.isUnsaved()) {
            await createNewSong(user);
        } else {
            await updateExistingSong(user);
        }
    };
};
