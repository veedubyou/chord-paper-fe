import { Either, isLeft, left, right } from "fp-ts/lib/Either";
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
    // special custom shoe in for timing out instead of creating its own type
    iots.literal("timeout"),
]);

const BackendErrorValidator = iots.type({
    msg: iots.string,
    code: BackendErrorCodeValidator,
});

export type BackendError = iots.TypeOf<typeof BackendErrorValidator>;

export type RequestError = Either<string, BackendError>;

export const parseRequestError = async (
    unknownError: unknown
): Promise<RequestError> => {
    if (unknownError instanceof ky.HTTPError) {
        // cloning the response so that it can continue to be reused
        const responseClone = unknownError.response.clone();
        const jsonError: unknown = await responseClone.json();

        const decodeResult = BackendErrorValidator.decode(jsonError);
        if (isLeft(decodeResult)) {
            const decodeErrorMsg = decodeResult.left.toString();
            return left(
                `Failed to decode the backend error type: ${decodeErrorMsg}`
            );
        }
        return decodeResult;
    }

    if (unknownError instanceof ky.TimeoutError) {
        return right({
            code: "timeout",
            msg: "A backend request timed out",
        });
    }

    if (typeof unknownError === "string") {
        return left(unknownError);
    }

    if (typeof unknownError === "object" && unknownError !== null) {
        if (typeof unknownError.toString === "function") {
            return left(unknownError.toString());
        }
    }

    return left("An unparsable error has occurred");
};

export const getErrorMessageForUser = (backendError: BackendError): string => {
    switch (backendError.code) {
        case "create_song_exists": {
            return "Save failed: The song already exists and can't be created again!";
        }

        case "datastore_error": {
            return "The data operation was not successful - please check the console for more details";
        }

        case "failed_google_verification": {
            return "Google verification failed: Please try to refresh and login again";
        }

        case "get_songs_for_user_not_allowed": {
            return "Loading songs failed: You don't have permission to see this user's songs";
        }

        case "no_account": {
            return "Sorry, it appears you don't have an account with Chord Paper and can't perform this operation";
        }

        case "song_not_found": {
            return "Not found: A song of this ID cannot be found";
        }

        case "timeout": {
            return "The server timed out. It may be unavailable right now.";
        }

        case "update_song_overwrite": {
            return "Autosave failed: This song has been updated recently and saving now will clobber previously saved results. Please try to load the song in another tab and copy your work over to save it";
        }

        case "update_song_owner_not_allowed": {
            return "Autosave failed: You don't have permission to update this user's songs";
        }

        case "update_song_wrong_id": {
            return "Autosave failed: There is a mismatch of song IDs. Please refresh and try again";
        }
    }
};

export const useErrorSnackbar = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showErrorMsg = (msg: string) => {
        enqueueSnackbar(msg, { variant: "error" });
    };

    return async (requestError: RequestError) => {
        if (isLeft(requestError)) {
            console.error(requestError.left);

            showErrorMsg(
                "An unknown error has occurred - please check the console for more details"
            );
            return;
        }

        const backendError = requestError.right;

        console.error(backendError.msg);

        const userErrorMsg = getErrorMessageForUser(backendError);
        showErrorMsg(userErrorMsg);
    };
};
