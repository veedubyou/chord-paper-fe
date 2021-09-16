import { Either, isLeft } from "fp-ts/lib/Either";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    getTrackList,
    updateTrackList,
} from "../../../common/backend/requests";
import { TrackList } from "../../../common/ChordModel/tracks/TrackList";
import { FetchState } from "../../../common/fetch";
import { PlainFn } from "../../../common/PlainFn";

interface LoadingTrackListState {
    state: "loading";
}

interface ErrorTrackListState {
    state: "error";
    error: unknown;
}

interface LoadedTrackListState {
    state: "loaded";
    tracklist: TrackList;
}

export type TrackListLoad =
    | LoadedTrackListState
    | LoadingTrackListState
    | ErrorTrackListState;

export type TrackListUpdateFn = (
    tracklist: TrackList,
    userAuthToken: string | null
) => Promise<void>;

const refreshDebounceThreshold = 500;

export const useTracklistFetch = (
    tracklistID: string
): [TrackListLoad, PlainFn, TrackListUpdateFn] => {
    const [fetchState, setFetchState] = useState<FetchState<TrackList>>({
        state: "not-started",
    });

    const refresh = useDebouncedCallback(
        () => setFetchState({ state: "not-started" }),
        refreshDebounceThreshold
    );

    const handleFetchedTracklist = (fetchResult: Either<Error, unknown>) => {
        if (isLeft(fetchResult)) {
            setFetchState({ state: "error", error: fetchResult.left });
            return;
        }

        const result = TrackList.fromJSONObject(fetchResult.right);
        if (isLeft(result)) {
            setFetchState({
                state: "error",
                error: "Failed to deserialize payload to tracklist",
            });
            return;
        }

        setFetchState({ state: "loaded", item: result.right });
    };

    const fetchTrackList = async () => {
        let fetchResult = await getTrackList(tracklistID);
        handleFetchedTracklist(fetchResult);
    };

    const updateTracklist = async (
        tracklist: TrackList,
        userAuthToken: string | null
    ) => {
        if (userAuthToken === null) {
            setFetchState({ state: "loaded", item: tracklist });
            return;
        }

        const updateResult = await updateTrackList(tracklist, userAuthToken);
        handleFetchedTracklist(updateResult);
    };

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            fetchTrackList();
            return [{ state: "loading" }, refresh, updateTracklist];
        }

        case "error": {
            return [
                { state: "error", error: fetchState.error },
                refresh,
                updateTracklist,
            ];
        }

        case "loading": {
            return [{ state: "loading" }, refresh, updateTracklist];
        }

        case "loaded": {
            return [
                { state: "loaded", tracklist: fetchState.item },
                refresh,
                updateTracklist,
            ];
        }
    }
};
