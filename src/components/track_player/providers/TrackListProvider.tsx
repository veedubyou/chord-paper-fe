import { ChordSong } from "common/ChordModel/ChordSong";
import { TrackList } from "common/ChordModel/tracks/TrackList";
import { PlainFn } from "common/PlainFn";
import OneTimeErrorNotification from "components/display/OneTimeErrorNotification";
import { useTracklistFetch } from "components/track_player/providers/useTracklistFetch";
import { User, UserContext } from "components/user/userContext";
import React from "react";

interface LoadingTrackListState {
    state: "loading";
}

interface LoadedTrackListState {
    state: "loaded";
    tracklist: TrackList;
}

export type TrackListLoad = LoadedTrackListState | LoadingTrackListState;
export type TrackListChangeHandler = (tracklist: TrackList) => Promise<void>;

interface TrackListProviderProps {
    song: ChordSong;
    children: (
        trackLoad: TrackListLoad,
        onRefresh: PlainFn,
        onTrackListChanged: TrackListChangeHandler
    ) => JSX.Element;
}

const TrackListProvider: React.FC<TrackListProviderProps> = (
    props: TrackListProviderProps
): JSX.Element => {
    const [tracklistLoad, refresh, updateTrackList] = useTracklistFetch(
        props.song.id
    );

    const user: User | null = React.useContext(UserContext);

    const handleTrackListChanged = async (tracklist: TrackList) => {
        if (user === null || !props.song.isOwner(user)) {
            await updateTrackList(tracklist, null);
            return;
        }

        await updateTrackList(tracklist, user.authToken);
    };

    switch (tracklistLoad.state) {
        case "error": {
            return (
                <OneTimeErrorNotification
                    componentDescription="Track List"
                    error={tracklistLoad.error}
                />
            );
        }
        case "loading": {
            return props.children(
                { state: "loading" },
                refresh,
                handleTrackListChanged
            );
        }
        case "loaded": {
            return props.children(
                { state: "loaded", tracklist: tracklistLoad.tracklist },
                refresh,
                handleTrackListChanged
            );
        }
    }
};

export default TrackListProvider;
