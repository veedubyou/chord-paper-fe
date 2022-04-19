import { Either, isLeft, left } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import ky from "ky";
import { useSnackbar } from "notistack";

// list of all known error codes
const BackendErrorCodeValidator = iots.union([
    iots.literal("no_account"),
    iots.literal("failed_google_verification"),
    iots.literal("create_song_exists"),
    iots.literal("update_song_overwrite"),
    iots.literal("song_not_found"),
    iots.literal("get_songs_for_user_not_allowed"),
    iots.literal("update_song_owner_not_allowed"),
    iots.literal("update_song_wrong_id"),
    iots.literal("datastore_error"),
]);

const BackendErrorValidator = iots.type({
    msg: iots.string,
    code: BackendErrorCodeValidator
})

export type BackendError = iots.TypeOf<typeof BackendErrorValidator>;

export type UnknownError = unknown;
export type RequestError = Either<UnknownError, BackendError>;

export const parseRequestError = async (
    unknownError: UnknownError
): Promise<RequestError> => {
    if (!(unknownError instanceof ky.HTTPError)) {
        return left(unknownError);
    }

    // cloning the response so that it can continue to be reused
    const responseClone = unknownError.response.clone();
    const jsonError: unknown = await responseClone.json();

    const decodeResult = BackendErrorValidator.decode(jsonError)
    return decodeResult;
};

export const useErrorSnackbar = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showErrorMsg = (msg: string) => {
        enqueueSnackbar(msg, { variant: "error" });
    };

    return async (unknownError: unknown) => {
        const jsonErrorResult = await parseRequestError(unknownError);

        if (isLeft(jsonErrorResult)) {
            console.error(jsonErrorResult.left);
            console.error(unknownError);

            showErrorMsg(
                "An unknown error has occurred - please check the console for more details"
            );
            return;
        }

        const jsonError = jsonErrorResult.right;

        console.error(jsonError.msg);

        switch (jsonError.code) {
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
                    "Loading songs failed: You don't have permission to see this user's songs"
                );
                break;
            }

            case "update_song_owner_not_allowed": {
                showErrorMsg(
                    "Autosave failed: You don't have permission to update this user's songs"
                );
                break;
            }

            case "update_song_wrong_id": {
                showErrorMsg(
                    "Autosave failed: There is a mismatch of song IDs. Please refresh and try again"
                );
                break;
            }

            case "datastore_error": {
                showErrorMsg(
                    "The data operation was not successful - please check the console for more details"
                );
                break;
            }
        }
    };
};
