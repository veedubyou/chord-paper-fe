import { Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { TimestampedSection } from "common/ChordModel/ChordLine";
import { TrackList } from "common/ChordModel/tracks/TrackList";
import { PlainFn } from "common/PlainFn";
import TrackListEditDialog from "components/track_player/dialog/TrackListEditDialog";
import { usePlayerControls } from "components/track_player/internal_player/usePlayerControls";
import MicroPlayer from "components/track_player/MicroPlayer";
import MultiTrackPlayer from "components/track_player/MultiTrackPlayer";
import { TrackListLoad } from "components/track_player/providers/TrackListProvider";
import { List } from "immutable";
import React, { useCallback, useState } from "react";
import shortid from "shortid";

type PlayerVisibilityState = "minimized" | "full";

interface JamStationProps {
    tracklistLoad: TrackListLoad;
    timestampedSections: List<TimestampedSection>;
    onTrackListChanged: (trackList: TrackList) => void;
    onRefresh: PlainFn;
    collapsedButtonSx?: SystemStyleObject<Theme>;
    fullScreen?: boolean;
}

interface TrackEditDialogState {
    open: boolean;
    randomID: string;
}

const JamStation: React.FC<JamStationProps> = (
    props: JamStationProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] =
        useState<PlayerVisibilityState>("minimized");

    const [trackEditDialogState, setTrackEditDialogState] =
        useState<TrackEditDialogState>({ open: false, randomID: "" });

    // lazy loading - if we just render everything it will also
    // cause heavy network traffic, don't do it without prompt
    const [loadPlayers, setLoadPlayers] = useState(false);

    const playerControls = usePlayerControls(props.timestampedSections);

    const trackListIsEmpty =
        props.tracklistLoad.state === "loaded" &&
        props.tracklistLoad.tracklist.tracks.length === 0;

    const collapsedButtonFn = (
        disabled: boolean,
        expandFn: () => void,
        tooltipMessage: string
    ) => (
        <MicroPlayer
            sx={props.collapsedButtonSx}
            show={playerVisibilityState === "minimized"}
            playersLoaded={loadPlayers}
            playing={playerControls.playing}
            togglePlay={playerControls.transport.togglePlay}
            jumpBack={playerControls.transport.jumpBack}
            jumpForward={playerControls.transport.jumpForward}
            tooltipMessage={tooltipMessage}
            disabled={disabled}
            onClick={expandFn}
        />
    );

    const handleTrackListChange = (tracklist: TrackList) => {
        closeTrackEditDialog();
        props.onTrackListChanged?.(tracklist);
    };

    const openTrackEditDialog = useCallback(() => {
        setTrackEditDialogState({ open: true, randomID: shortid.generate() });
    }, [setTrackEditDialogState]);

    const closeTrackEditDialog = () => {
        setTrackEditDialogState({ open: false, randomID: "" });
    };

    const trackEditDialog = trackEditDialogState.open && (
        <TrackListEditDialog
            key={trackEditDialogState.randomID}
            open={trackEditDialogState.open}
            trackListLoad={props.tracklistLoad}
            onSubmit={handleTrackListChange}
            onClose={closeTrackEditDialog}
            onRefresh={props.onRefresh}
        />
    );

    const showPlayer = useCallback(() => {
        if (!loadPlayers) {
            setLoadPlayers(true);
        }

        setPlayerVisibilityState("full");
    }, [loadPlayers, setLoadPlayers, setPlayerVisibilityState]);

    const minimizePlayer = useCallback(() => {
        setPlayerVisibilityState("minimized");
    }, [setPlayerVisibilityState]);

    if (trackListIsEmpty) {
        // prompt the user to add tracks if there is none
        return (
            <>
                {collapsedButtonFn(false, openTrackEditDialog, "Show Player")}
                {trackEditDialog}
            </>
        );
    }

    if (!loadPlayers) {
        return collapsedButtonFn(false, showPlayer, "Show Player");
    }

    const fullPlayer: false | JSX.Element = loadPlayers && (
        <MultiTrackPlayer
            show={playerVisibilityState === "full"}
            fullScreen={props.fullScreen}
            tracklistLoad={props.tracklistLoad}
            playerControls={playerControls}
            onMinimize={minimizePlayer}
            onRefresh={props.onRefresh}
            onOpenTrackEditDialog={openTrackEditDialog}
        />
    );

    return (
        <>
            {collapsedButtonFn(false, showPlayer, "Show Player")}
            {fullPlayer}
            {trackEditDialog}
        </>
    );
};

export default JamStation;
