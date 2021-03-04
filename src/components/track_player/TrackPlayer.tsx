import React, { useState } from "react";
import shortid from "shortid";
import { Track } from "../../common/ChordModel/Track";
import CollapsedButton from "./CollapsedButton";
import FullSizedPlayer from "./FullSizedPlayer";
import { addCacheBuster, isGoogleDriveExportLink } from "./google_drive";
import TrackListEditDialog from "./TrackListEditDialog";

type PlayerVisibilityState = "collapsed" | "full";

interface TrackPlayerProps {
    trackList: Track[];
    onTrackListChanged?: (trackList: Track[]) => void;
    collapsedButtonClassName?: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] = useState<
        PlayerVisibilityState
    >("collapsed");

    const [trackEditDialogOpen, setTrackEditDialogOpen] = useState(false);
    const [currTrackIndex, setCurrTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [cacheBusterID] = useState<string>(shortid.generate());

    const canEditTrackList = props.onTrackListChanged !== undefined;
    const trackListIsEmpty = props.trackList.length === 0;

    const collapsedButtonFn = (
        disabled: boolean,
        expandFn: () => void,
        tooltipMessage: string
    ) => (
        <CollapsedButton
            className={props.collapsedButtonClassName}
            show={playerVisibilityState === "collapsed"}
            tooltipMessage={tooltipMessage}
            disabled={disabled}
            onClick={expandFn}
        />
    );

    const handleTrackListChange = (track: Track[]) => {
        setTrackEditDialogOpen(false);
        props.onTrackListChanged?.(track);
    };

    const trackEditDialog = trackEditDialogOpen && (
        <TrackListEditDialog
            open={trackEditDialogOpen}
            trackList={props.trackList}
            onSubmit={handleTrackListChange}
            onClose={() => setTrackEditDialogOpen(false)}
        />
    );

    if (trackListIsEmpty) {
        // can't add any tracks, also nothing to play. just show a disabled button
        if (!canEditTrackList) {
            return collapsedButtonFn(
                true,
                () => {},
                "No audio tracks available"
            );
        }

        // prompt the user to add tracks if there is none
        return (
            <>
                {collapsedButtonFn(
                    false,
                    () => setTrackEditDialogOpen(true),
                    "Show Player"
                )}
                {trackEditDialog}
            </>
        );
    }

    const processedTrackList: Track[] = props.trackList.map((track: Track) => {
        // Firefox caches some redirects on Google Drive links, which eventually leads
        // to 403 on subsequent reloads. Breaking the cache here so that the loading doesn't break
        if (isGoogleDriveExportLink(track.url)) {
            return {
                label: track.label,
                url: addCacheBuster(track.url, cacheBusterID),
            };
        }

        return track;
    });

    const fullPlayer = (
        <FullSizedPlayer
            show={playerVisibilityState === "full"}
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            currentTrackIndex={currTrackIndex}
            trackList={processedTrackList}
            onCollapse={() => setPlayerVisibilityState("collapsed")}
            onSelectCurrentTrack={(currentTrackIndex: number) =>
                setCurrTrackIndex(currentTrackIndex)
            }
            onOpenTrackEditDialog={
                canEditTrackList
                    ? () => setTrackEditDialogOpen(true)
                    : undefined
            }
        />
    );

    return (
        <>
            {collapsedButtonFn(
                false,
                () => setPlayerVisibilityState("full"),
                "Show Player"
            )}
            {fullPlayer}
            {trackEditDialog}
        </>
    );
};

export default TrackPlayer;
