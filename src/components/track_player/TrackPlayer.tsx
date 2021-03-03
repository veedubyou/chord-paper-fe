import React, { useState } from "react";
import { Track } from "../../common/ChordModel/Track";
import CollapsedButton from "./CollapsedButton";
import FullSizedPlayer from "./FullSizedPlayer";
import TrackListEditDialog from "./TrackListEditDialog";

type PlayerVisibilityState = "collapsed" | "full";

interface TrackPlayerProps {
    trackList: Track[];
    url: string;
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

    const fullPlayer = (
        <FullSizedPlayer
            show={playerVisibilityState === "full"}
            currentTrackIndex={currTrackIndex}
            trackList={props.trackList}
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
