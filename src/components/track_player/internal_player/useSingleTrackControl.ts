import { useRef } from "react";
import shortid from "shortid";
import { SingleTrack } from "../../../common/ChordModel/Track";
import { ensureGoogleDriveCacheBusted } from "../google_drive";

export interface SingleTrackControl {
    trackType: "single";
    url: string;
}

type SingleTrackControlMaker = (track: SingleTrack) => SingleTrackControl;

export const useSingleTrackControl = (): SingleTrackControlMaker => {
    const cacheBusterID = useRef<string>(shortid.generate());

    const processTrackURL = (url: string): string => {
        // Firefox caches some redirects on Google Drive links, which eventually leads
        // to 403 on subsequent reloads. Breaking the cache here so that the loading doesn't break
        return ensureGoogleDriveCacheBusted(url, cacheBusterID.current);
    };

    return (track: SingleTrack) => {
        return {
            trackType: "single",
            url: processTrackURL(track.url),
        };
    };
};
