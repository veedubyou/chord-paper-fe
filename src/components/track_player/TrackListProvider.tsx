import { Either } from "fp-ts/lib/Either";
import { isLeft } from "fp-ts/lib/These";
import React, { useState } from "react";
import { useErrorMessage } from "../../common/backend/errors";
import { getTrackList, updateTrackList } from "../../common/backend/requests";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { TrackList } from "../../common/ChordModel/tracks/TrackList";
import { FetchState } from "../../common/fetch";
import { PlainFn } from "../../common/PlainFn";
import ErrorImage from "../display/ErrorImage";
import { User, UserContext } from "../user/userContext";

export type TrackListChangeHandler = (tracklist: TrackList) => void;

interface LoadingTrackListState {
    state: "loading";
}

interface LoadedTrackListState {
    state: "loaded";
    tracklist: TrackList;
}

export type TrackListLoad = LoadedTrackListState | LoadingTrackListState;

interface TrackListProviderProps {
    song: ChordSong;
    children: (
        tracklistLoad: TrackListLoad,
        changeHandler: TrackListChangeHandler,
        onRefresh: PlainFn
    ) => JSX.Element;
}

const TrackListProvider: React.FC<TrackListProviderProps> = (
    props: TrackListProviderProps
): JSX.Element => {
    const showError = useErrorMessage();
    const user: User | null = React.useContext(UserContext);

    const [fetchState, setFetchState] = useState<FetchState<TrackList>>({
        state: "not-started",
    });

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
        let fetchResult = await getTrackList(props.song.id);
        handleFetchedTracklist(fetchResult);
    };

    const handleTrackListChanged = async (tracklist: TrackList) => {
        if (user === null || !props.song.isOwner(user)) {
            setFetchState({ state: "loaded", item: tracklist });
            return;
        }

        const updateResult = await updateTrackList(tracklist, user.authToken);
        handleFetchedTracklist(updateResult);
    };

    const refresh = () => setFetchState({ state: "not-started" });

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            fetchTrackList();
            return <></>;
        }
        case "error": {
            showError(fetchState.error);
            return <ErrorImage />;
        }
        case "loading": {
            return props.children(
                { state: "loading" },
                handleTrackListChanged,
                refresh
            );
        }
        case "loaded": {
            return props.children(
                { state: "loaded", tracklist: fetchState.item },
                handleTrackListChanged,
                refresh
            );
        }
    }
};

export default TrackListProvider;
