import { useSnackbar } from "notistack";
import ky from "ky";

interface BackendError {
    code: string;
    msg: string;
}

const validateError = (json: unknown): json is BackendError => {
    if (typeof json !== "object") {
        return false;
    }

    if (json === null || json === undefined) {
        return false;
    }

    return "code" in json && "msg" in json;
};

export const useErrorMessage = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showErrorMsg = (msg: string) => {
        enqueueSnackbar(msg, { variant: "error" });
    };

    return async (unknownError: any) => {
        const showGenericErrorMsg = () => {
            console.error(unknownError);

            showErrorMsg(
                "An unknown error has occurred - please check the console for more details"
            );
        };

        if (!(unknownError instanceof ky.HTTPError)) {
            showGenericErrorMsg();
            return;
        }

        // cloning the response so that it can continue to be reused
        const responseClone = unknownError.response.clone();
        const error: unknown = await responseClone.json();

        if (!validateError(error)) {
            showGenericErrorMsg();
            return;
        }

        console.error(error.msg);

        switch (error.code) {
            case "create_song_exists": {
                showErrorMsg(
                    "Save failed: The song already exists and can't be created again!"
                );
                break;
            }

            case "update_song_overwrite": {
                showErrorMsg(
                    "Autosave failed: This song has been updated recently and saving now will clobber previously saved results. Please try to load the song in another tab and copy your work over to save it"
                );
                break;
            }
            case "song_not_found": {
                showErrorMsg("Not found: A song of this ID cannot be found");
                break;
            }
            case "failed_google_verification": {
                showErrorMsg(
                    "Google verification failed: Please try to refresh and login again"
                );
                break;
            }

            case "get_songs_for_user_not_allowed": {
                showErrorMsg(
                    "You don't have permission to see this user's songs"
                );
                break;
            }

            case "update_song_owner_not_allowed": {
                showErrorMsg(
                    "You don't have permission to update this user's songs"
                );
                break;
            }

            case "update_song_wrong_id": {
                showErrorMsg(
                    "Update failed: There is a mismatch of song IDs. Please refresh and try again"
                );
                break;
            }

            case "datastore_error": {
                showErrorMsg(
                    "The data operation was not successful - please check the console for more details"
                );
                break;
            }

            default: {
                showErrorMsg(
                    "An unknown error has occurred - please check the console for more details"
                );
                break;
            }
        }
    };
};
