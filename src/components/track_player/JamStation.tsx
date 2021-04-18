import React, { useState } from "react";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { TrackList } from "../../common/ChordModel/Track";
import MultiTrackPlayer from "./MultiTrackPlayer";
import MinimizedButton from "./MinimizedButton";
import TrackListEditDialog from "./dialog/TrackListEditDialog";

type PlayerVisibilityState = "minimized" | "full";

interface JamStationProps {
    trackList: TrackList;
    timeSections: TimeSection[];
    onTrackListChanged?: (trackList: TrackList) => void;
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
    const [playrate, setPlayrate] = useState(100);

    const canEditTrackList = props.onTrackListChanged !== undefined;
    const trackListIsEmpty = props.trackList.tracks.length === 0;

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
        <MultiTrackPlayer
            show={playerVisibilityState === "full"}
            tracklist={props.trackList}
            timeSections={props.timeSections}
            playrate={playrate}
            onPlayrateChange={setPlayrate}
            currentTrackIndex={currentTrackIndex}
            onSelectCurrentTrack={setCurrentTrackIndex}
            onMinimize={() => setPlayerVisibilityState("minimized")}
            onOpenTrackEditDialog={
                canEditTrackList ? openTrackEditDialog : undefined
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

export default JamStation;
