import { Either, left, right } from "fp-ts/lib/Either";
import ky from "ky";
import { ChordSong } from "./ChordModel/ChordSong";

const backendHost = ((): string => {
    const localURL = "http://localhost:5000";

    if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
    ) {
        return localURL;
    }

    const backendURL: string | undefined = process.env.REACT_APP_BACKEND_URL;
    if (backendURL === undefined) {
        console.error("Production build doesn't have backend URL set!");
        return localURL;
    }

    return backendURL;
})();

export const login = async (
    authToken: string
): Promise<Either<Error, unknown>> => {
    let parsed: unknown;

    try {
        parsed = await ky
            .post(`${backendHost}/login`, {
                headers: {
                    Authorization: "Bearer " + authToken,
                },
            })
            .json();
    } catch (e) {
        return left(e);
    }

    return right(parsed);
};

export const getSong = async (
    songID: string
): Promise<Either<Error, unknown>> => {
    let parsed: unknown;

    try {
        parsed = await ky.get(`${backendHost}/songs/${songID}`).json();
    } catch (e) {
        return left(e);
    }

    return right(parsed);
};

export const getSongsForUser = async (
    userID: string,
    authToken: string
): Promise<Either<Error, unknown>> => {
    let parsed: unknown;

    try {
        parsed = await ky
            .get(`${backendHost}/users/${userID}/songs`, {
                headers: {
                    Authorization: "Bearer " + authToken,
                },
            })
            .json();
    } catch (e) {
        return left(e);
    }

    return right(parsed);
};

export const createSong = async (
    song: ChordSong,
    authToken: string
): Promise<Either<Error, unknown>> => {
    let parsed: unknown;

    try {
        parsed = await ky
            .post(`${backendHost}/songs`, {
                json: song,
                headers: {
                    Authorization: "Bearer " + authToken,
                },
            })
            .json();
    } catch (e) {
        return left(e);
    }

    return right(parsed);
};

export const updateSong = async (
    song: ChordSong,
    authToken: string
): Promise<Either<Error, unknown>> => {
    if (song.isUnsaved()) {
        return left(
            new Error("A song that hasn't been created can't be updated")
        );
    }

    let parsed: unknown;

    try {
        parsed = await ky
            .put(`${backendHost}/songs/${song.id}`, {
                json: song,
                headers: {
                    Authorization: "Bearer " + authToken,
                },
            })
            .json();
    } catch (e) {
        return left(e);
    }

    return right(parsed);
};
