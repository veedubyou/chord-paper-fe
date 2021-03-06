import React, { useState } from "react";
import { Track } from "../../common/ChordModel/Track";
import CollapsedButton from "./CollapsedButton";
import FullSizedPlayer from "./FullSizedPlayer";
import TrackListEditDialog from "./TrackListEditDialog";
import { useMultiTrack } from "./useMultiTrack";

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
    const [loadPlayers, setLoadPlayers] = useState(false);

    const [trackControls, onCurrentTrackIndexChange] = useMultiTrack(
        props.trackList
    );

    const canEditTrackList = props.onTrackListChanged !== undefined;
    const trackListIsEmpty = trackControls.length === 0;

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

    const fullPlayer: false | JSX.Element = loadPlayers && (
        <FullSizedPlayer
            show={playerVisibilityState === "full"}
            trackControls={trackControls}
            onCollapse={() => setPlayerVisibilityState("collapsed")}
            onSelectCurrentTrack={onCurrentTrackIndexChange}
            onOpenTrackEditDialog={
                canEditTrackList
                    ? () => setTrackEditDialogOpen(true)
                    : undefined
            }
        />
    );

    const collapsedButtonClickHandler = () => {
        if (!loadPlayers) {
            setLoadPlayers(true);
        }

        setPlayerVisibilityState("full");
    };

    return (
        <>
            {collapsedButtonFn(
                false,
                collapsedButtonClickHandler,
                "Show Player"
            )}
            {fullPlayer}
            {trackEditDialog}
        </>
    );
};

export default TrackPlayer;
