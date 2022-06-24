import { parseRequestError, RequestError } from "common/backend/errors";
import { ChordSong } from "common/ChordModel/ChordSong";
import { TrackList } from "common/ChordModel/tracks/TrackList";
import { Either, left, right } from "fp-ts/lib/Either";
import ky from "ky";

export type ResponseJSON = unknown;
export type BackendResult = Either<RequestError, ResponseJSON>;

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

const authHeader = (authToken: string) => {
    return {
        headers: { Authorization: "Bearer " + authToken },
    };
};

export const login = async (authToken: string): Promise<BackendResult> => {
    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .post(`${backendHost}/login`, authHeader(authToken))
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const getSong = async (songID: string): Promise<BackendResult> => {
    let parsed: ResponseJSON;

    try {
        parsed = await ky.get(`${backendHost}/songs/${songID}`).json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const getTrackList = async (songID: string): Promise<BackendResult> => {
    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .get(`${backendHost}/songs/${songID}/tracklist`, { timeout: false })
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const getSongsForUser = async (
    userID: string,
    authToken: string
): Promise<BackendResult> => {
    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .get(`${backendHost}/users/${userID}/songs`, authHeader(authToken))
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const createSong = async (
    song: ChordSong,
    authToken: string
): Promise<BackendResult> => {
    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .post(`${backendHost}/songs`, {
                json: song,
                ...authHeader(authToken),
            })
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const updateSong = async (
    song: ChordSong,
    authToken: string
): Promise<BackendResult> => {
    if (song.isUnsaved()) {
        return left(left("A song that hasn't been created can't be updated"));
    }

    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .put(`${backendHost}/songs/${song.id}`, {
                json: song,
                ...authHeader(authToken),
            })
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};

export const deleteSong = async (
    song: ChordSong,
    authToken: string
): Promise<Either<RequestError, true>> => {
    if (song.isUnsaved()) {
        return left(left("A song that hasn't been created can't be deleted"));
    }

    try {
        await ky.delete(
            `${backendHost}/songs/${song.id}`,
            authHeader(authToken)
        );
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(true);
};

export const updateTrackList = async (
    tracklist: TrackList,
    authToken: string
): Promise<BackendResult> => {
    if (tracklist.song_id === "") {
        return left(left("No song ID on the tracklist"));
    }

    let parsed: ResponseJSON;

    try {
        parsed = await ky
            .put(`${backendHost}/songs/${tracklist.song_id}/tracklist`, {
                json: tracklist,
                ...authHeader(authToken),
            })
            .json();
    } catch (e) {
        const parsedError: RequestError = await parseRequestError(e);
        return left(parsedError);
    }

    return right(parsed);
};
