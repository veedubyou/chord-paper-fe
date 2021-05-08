import React, { useCallback, useEffect, useState } from "react";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { TrackList } from "../../common/ChordModel/tracks/TrackList";
import MultiTrackPlayer from "./MultiTrackPlayer";
import MinimizedButton from "./MinimizedButton";
import TrackListEditDialog from "./dialog/TrackListEditDialog";
import { useRegisterTopKeyListener } from "../GlobalKeyListener";
import { PlainFn } from "../../common/PlainFn";
import { TrackListLoad } from "./TrackListProvider";

type PlayerVisibilityState = "minimized" | "full";

interface JamStationProps {
    tracklistLoad: TrackListLoad;
    timeSections: TimeSection[];
    onTrackListChanged: (trackList: TrackList) => void;
    onRefresh: PlainFn;
    collapsedButtonClassName?: string;
}

interface TrackEditDialogState {
    open: boolean;
    randomID: string;
}

const JamStation: React.FC<JamStationProps> = (
    props: JamStationProps
): JSX.Element => {
    const [playerVisibilityState, setPlayerVisibilityState] = useState<
        PlayerVisibilityState
    >("minimized");

    const [trackEditDialogState, setTrackEditDialogState] = useState<
        TrackEditDialogState
    >({ open: false, randomID: "" });
    const [loadPlayers, setLoadPlayers] = useState(false);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();

    const trackListIsEmpty =
        props.tracklistLoad.state === "loaded" &&
        props.tracklistLoad.tracklist.tracks.length === 0;

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

    useEffect(() => {
        if (trackListIsEmpty) {
            return;
        }

        const handleKey = (event: KeyboardEvent) => {
            // only fire for "default" targets, when the user isn't particularly interacting
            // with anything else
            if (event.target !== document.body) {
                return;
            }

            if (event.code !== "Slash") {
                return;
            }

            if (playerVisibilityState === "minimized") {
                showPlayer();
            } else {
                minimizePlayer();
            }

            event.preventDefault();
            event.stopImmediatePropagation();
        };

        addTopKeyListener(handleKey);
        return () => removeKeyListener(handleKey);
    }, [
        addTopKeyListener,
        removeKeyListener,
        playerVisibilityState,
        showPlayer,
        minimizePlayer,
        trackListIsEmpty,
    ]);

    if (trackListIsEmpty) {
        // prompt the user to add tracks if there is none
        return (
            <>
                {collapsedButtonFn(false, openTrackEditDialog, "Show Player")}
                {trackEditDialog}
            </>
        );
    }

    const fullPlayer: false | JSX.Element = loadPlayers && (
        <MultiTrackPlayer
            show={playerVisibilityState === "full"}
            tracklistLoad={props.tracklistLoad}
            timeSections={props.timeSections}
            currentTrackIndex={currentTrackIndex}
            onSelectCurrentTrack={setCurrentTrackIndex}
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
