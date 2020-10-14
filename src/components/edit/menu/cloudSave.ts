import { isLeft } from "fp-ts/lib/These";
import ky from "ky";
import { useSnackbar } from "notistack";
import React from "react";
import { useHistory } from "react-router-dom";
import { backendHost } from "../../../common/backend";

import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { UserContext } from "../../user/userContext";

export const useCloudSaveAction = (song: ChordSong) => {
    const user = React.useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    return async () => {
        if (user === null) {
            enqueueSnackbar("You must log in to save your song", {
                variant: "error",
            });
            return;
        }

        song.owner = user.user_id;

        let parsed: unknown;

        try {
            parsed = await ky
                .post(backendHost + "/songs", {
                    json: song,
                    headers: {
                        Authorization: "Bearer " + user.google_auth_token,
                    },
                })
                .json();
        } catch (e) {
            console.error("Failed to make create song request to BE", e);
            enqueueSnackbar(
                "Failed to create song to backend. Check console for more error details",
                { variant: "error" }
            );

            return;
        }

        let result = ChordSong.fromJSONObject(parsed);

        if (isLeft(result)) {
            console.error("Backend response does not match song format");
            console.log(parsed);
            enqueueSnackbar(
                "A failure happened. Check console for more error details",
                { variant: "error" }
            );
            return;
        }

        song.id = result.right.id;
        //TODO: this code is super fucked, but this will all go away soon
        // when auto save happens
        history.push("/song/" + song.id + "/edit");
    };
};
