import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { createSong } from "../../../common/backend";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { songPath } from "../../../common/paths";
import { User } from "../../user/userContext";

export const useCloudCreateSong = (song: ChordSong) => {
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

        const deserializedSong = deserializeResult.right;
        history.push(
            songPath.withID(deserializedSong.id).withMode("edit").URL()
        );
    };

    return async (user: User) => {
        if (song.isUnsaved()) {
            await createNewSong(user);
        }
    };
};
