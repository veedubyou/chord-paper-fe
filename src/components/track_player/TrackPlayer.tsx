import React, { useState } from "react";
import { Track } from "../../common/ChordModel/Track";
import MinimizedButton from "./MinimizedButton";
import CompactPlayer from "./CompactPlayer";
import FullPlayer from "./FullPlayer";
import TrackListEditDialog from "./TrackListEditDialog";
import { useMultiTrack } from "./useMultiTrack";
import { TimeSection } from "../../common/ChordModel/ChordLine";

type PlayerVisibilityState = "minimized" | "compact" | "full";

interface TrackPlayerProps {
    trackList: Track[];
    timeSections: TimeSection[];
    onTrackListChanged?: (trackList: Track[]) => void;
    collapsedButtonClassName?: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] = useState<
        PlayerVisibilityState
    >("minimized");

    const [trackEditDialogOpen, setTrackEditDialogOpen] = useState(false);
    const [loadPlayers, setLoadPlayers] = useState(false);

    const [fullPlayerControl, compactPlayerControl] = useMultiTrack(
        props.trackList,
        props.timeSections
    );

    const canEditTrackList = props.onTrackListChanged !== undefined;
    const trackListIsEmpty = fullPlayerControl.trackControls.length === 0;

    const collapsedButtonFn = (
        disabled: boolean,
        expandFn: () => void,
        tooltipMessage: string
    ) => (
        <MinimizedButton
            className={props.collapsedButtonClassName}
            show={playerVisibilityState === "minimized"}
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
        <FullPlayer
            show={playerVisibilityState === "full"}
            trackControls={fullPlayerControl.trackControls}
            playrate={fullPlayerControl.playrate}
            currentSectionLabel={fullPlayerControl.currentSectionLabel}
            onPlayrateChange={fullPlayerControl.onPlayrateChange}
            onCollapse={() => setPlayerVisibilityState("compact")}
            onSelectCurrentTrack={fullPlayerControl.onCurrentTrackIndexChange}
            onOpenTrackEditDialog={
                canEditTrackList
                    ? () => setTrackEditDialogOpen(true)
                    : undefined
            }
        />
    );

    const compactPlayer: false | JSX.Element = loadPlayers && (
        <CompactPlayer
            show={playerVisibilityState === "compact"}
            playing={compactPlayerControl.playing}
            play={compactPlayerControl.play}
            pause={compactPlayerControl.pause}
            jumpBack={compactPlayerControl.jumpBack}
            skipBack={compactPlayerControl.skipBack}
            onMinimize={() => setPlayerVisibilityState("minimized")}
            onMaximize={() => setPlayerVisibilityState("full")}
            currentTime={compactPlayerControl.currentTime}
            currentSectionLabel={compactPlayerControl.currentSectionLabel}
        />
    );

    const collapsedButtonClickHandler = () => {
        if (!loadPlayers) {
            setLoadPlayers(true);
        }

        setPlayerVisibilityState("compact");
    };

    return (
        <>
            {collapsedButtonFn(
                false,
                collapsedButtonClickHandler,
                "Show Player"
            )}
            {compactPlayer}
            {fullPlayer}
            {trackEditDialog}
        </>
    );
};

export default TrackPlayer;
