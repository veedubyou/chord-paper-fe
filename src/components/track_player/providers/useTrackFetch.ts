import { Track } from "../../../common/ChordModel/tracks/Track";
import { TrackList } from "../../../common/ChordModel/tracks/TrackList";
import { PlainFn } from "../../../common/PlainFn";
import { useTracklistFetch } from "./useTracklistFetch";

interface LoadingTrackState {
    state: "loading";
}

interface ErrorTrackState {
    state: "error";
    error: unknown;
}

interface LoadedTrackState {
    state: "loaded";
    track: Track;
}

export type TrackLoad = LoadedTrackState | LoadingTrackState | ErrorTrackState;

export const useTrackFetch = (
    tracklistID: string,
    trackID: string
): [TrackLoad, PlainFn] => {
    const [tracklistLoad, refresh] = useTracklistFetch(tracklistID);

    const findTrack = (tracklist: TrackList): Track | undefined => {
        const matchByID = (track: Track) => track.id === trackID;
        return tracklist.tracks.find(matchByID);
    };

    switch (tracklistLoad.state) {
        case "error": {
            return [{ state: "error", error: tracklistLoad.error }, refresh];
        }

        case "loading": {
            return [{ state: "loading" }, refresh];
        }

        case "loaded": {
            const track = findTrack(tracklistLoad.tracklist);
            if (track === undefined) {
                const notFoundError = new Error("Track is not found");

                return [{ state: "error", error: notFoundError }, refresh];
            }

            return [{ state: "loaded", track: track }, refresh];
        }
    }
};
