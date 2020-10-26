import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useErrorMessage } from "../../../common/backend/errors";
import { createSong } from "../../../common/backend/requests";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { songPath } from "../../../common/paths";
import { User } from "../../user/userContext";

export const useCloudCreateSong = (song: ChordSong) => {
    const { enqueueSnackbar } = useSnackbar();
    const showError = useErrorMessage();
    const history = useHistory();

    const createNewSong = async (user: User) => {
        song.owner = user.userID;

        const createResult = await createSong(song, user.authToken);

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
