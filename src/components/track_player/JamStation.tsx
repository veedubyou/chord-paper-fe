import { createMuiTheme, Theme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { List } from "immutable";
import React, { useCallback, useState } from "react";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { TrackList } from "../../common/ChordModel/tracks/TrackList";
import { PlainFn } from "../../common/PlainFn";
import TrackListEditDialog from "./dialog/TrackListEditDialog";
import { usePlayerControls } from "./internal_player/usePlayerControls";
import MicroPlayer from "./MicroPlayer";
import MultiTrackPlayer from "./MultiTrackPlayer";
import { TrackListLoad } from "./providers/TrackListProvider";

type PlayerVisibilityState = "minimized" | "full";

interface JamStationProps {
    tracklistLoad: TrackListLoad;
    timeSections: List<TimeSection>;
    onTrackListChanged: (trackList: TrackList) => void;
    onRefresh: PlainFn;
    collapsedButtonClassName?: string;
}

interface TrackEditDialogState {
    open: boolean;
    randomID: string;
}

const onTopTheme = (theme: Theme): Theme => {
    const highestZIndex = theme.zIndex.tooltip;
    const zIndexBoost = highestZIndex + 1;

    return createMuiTheme({
        ...theme,
        zIndex: {
            mobileStepper: zIndexBoost + theme.zIndex.mobileStepper,
            speedDial: zIndexBoost + theme.zIndex.speedDial,
            appBar: zIndexBoost + theme.zIndex.appBar,
            drawer: zIndexBoost + theme.zIndex.drawer,
            modal: zIndexBoost + theme.zIndex.modal,
            snackbar: zIndexBoost + theme.zIndex.snackbar,
            tooltip: zIndexBoost + theme.zIndex.tooltip,
        },
    });
};

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

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const playerControls = usePlayerControls(props.timeSections);

    const trackListIsEmpty =
        props.tracklistLoad.state === "loaded" &&
        props.tracklistLoad.tracklist.tracks.length === 0;

    const collapsedButtonFn = (
        disabled: boolean,
        expandFn: () => void,
        tooltipMessage: string
    ) => (
        <MicroPlayer
            className={props.collapsedButtonClassName}
            show={playerVisibilityState === "minimized"}
            playersLoaded={loadPlayers}
            playerControls={playerControls}
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
            tracklistLoad={props.tracklistLoad}
            playerControls={playerControls}
            currentTrackIndex={currentTrackIndex}
            onSelectCurrentTrack={setCurrentTrackIndex}
            onMinimize={minimizePlayer}
            onRefresh={props.onRefresh}
            onOpenTrackEditDialog={openTrackEditDialog}
        />
    );

    return (
        <ThemeProvider theme={onTopTheme}>
            {collapsedButtonFn(false, showPlayer, "Show Player")}
            {fullPlayer}
            {trackEditDialog}
        </ThemeProvider>
    );
};

export default JamStation;
