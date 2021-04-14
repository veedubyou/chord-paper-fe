import { Either } from "fp-ts/lib/Either";
import { isLeft } from "fp-ts/lib/These";
import React, { useState } from "react";
import { useErrorMessage } from "../../common/backend/errors";
import { getTrackList, updateTrackList } from "../../common/backend/requests";
import { TrackList } from "../../common/ChordModel/Track";
import { FetchState } from "../../common/fetch";
import ErrorImage from "../display/ErrorImage";
import { User, UserContext } from "../user/userContext";
import MinimizedButton from "./MinimizedButton";

export type TrackListChangeHandler = (tracklist: TrackList) => void;

interface TrackListProviderProps {
    songID: string;
    children: (
        tracklist: TrackList,
        changeHandler: TrackListChangeHandler
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
        let fetchResult = await getTrackList(props.songID);
        handleFetchedTracklist(fetchResult);
    };

    const handleTrackListChanged = async (tracklist: TrackList) => {
        if (user === null) {
            setFetchState({ state: "loaded", item: tracklist });
            return;
        }

        const updateResult = await updateTrackList(tracklist, user.authToken);
        handleFetchedTracklist(updateResult);
    };

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
            return (
                <MinimizedButton
                    show
                    tooltipMessage="Loading tracks..."
                    onClick={() => {}}
                />
            );
        }
        case "loaded": {
            return props.children(fetchState.item, handleTrackListChanged);
        }
    }
};

export default TrackListProvider;
