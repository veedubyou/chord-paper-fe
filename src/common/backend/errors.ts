import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import ky from "ky";
import { useSnackbar } from "notistack";


const BackendErrorValidator = iots.type({
    msg: iots.string,
    code: iots.string,
    error_details: iots.string,
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

        console.error(decodeResult.right.error_details);
        return decodeResult;
    }

    if (unknownError instanceof ky.TimeoutError) {
        return right({
            code: "timeout",
            msg: "A backend request timed out",
            error_details: "",
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
    return backendError.msg;
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
