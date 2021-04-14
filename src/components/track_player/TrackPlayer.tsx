import React, { useState } from "react";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { TrackList } from "../../common/ChordModel/Track";
import CompactPlayer from "./CompactPlayer";
import FullPlayer from "./FullPlayer";
import MinimizedButton from "./MinimizedButton";
import TrackListEditDialog from "./dialog/TrackListEditDialog";
import { usePlayer } from "./usePlayer";

type PlayerVisibilityState = "minimized" | "compact" | "full";

interface TrackPlayerProps {
    trackList: TrackList;
    timeSections: TimeSection[];
    onTrackListChanged?: (trackList: TrackList) => void;
    collapsedButtonClassName?: string;
}

interface TrackEditDialogState {
    open: boolean;
    randomID: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] = useState<
        PlayerVisibilityState
    >("minimized");

    const [trackEditDialogState, setTrackEditDialogState] = useState<
        TrackEditDialogState
    >({ open: false, randomID: "" });
    const [loadPlayers, setLoadPlayers] = useState(false);

    const [fullPlayerControl, compactPlayerControl] = usePlayer(
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

    const handleTrackListChange = (tracklist: TrackList) => {
        closeTrackEditDialog();
        props.onTrackListChanged?.(tracklist);
    };

    const openTrackEditDialog = () => {
        setTrackEditDialogState({ open: true, randomID: shortid.generate() });
    };

    const closeTrackEditDialog = () => {
        setTrackEditDialogState({ open: false, randomID: "" });
    };

    const trackEditDialog = trackEditDialogState.open && (
        <TrackListEditDialog
            key={trackEditDialogState.randomID}
            open={trackEditDialogState.open}
            trackList={props.trackList}
            onSubmit={handleTrackListChange}
            onClose={closeTrackEditDialog}
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
                {collapsedButtonFn(false, openTrackEditDialog, "Show Player")}
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
                canEditTrackList ? openTrackEditDialog : undefined
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
            jumpForward={compactPlayerControl.jumpForward}
            skipBack={compactPlayerControl.skipBack}
            skipForward={compactPlayerControl.skipForward}
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
