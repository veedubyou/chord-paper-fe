import {
    Box,
    Button,
    Divider,
    MenuItem,
    Select as UnstyledSelect,
    Slide,
    Theme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CollapseDownIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { Track } from "../../common/ChordModel/tracks/Track";
import { PlainFn } from "../../common/PlainFn";
import { useRegisterTopKeyListener } from "../GlobalKeyListener";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import {
    PlayerControls,
    unfocusedControls,
} from "./internal_player/usePlayerControls";
import { TrackListLoad } from "./providers/TrackListProvider";
import TrackPlayer from "./TrackPlayer";
import WaitingSpinner from "./WaitingSpinner";

const FlexBox = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        margin: theme.spacing(0.5),
    },
}))(Box);

const TitleBarButton = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(Button);

const usePaddingLeftStyle = makeStyles((theme: Theme) => ({
    root: {
        "& .MuiSelect-select": {
            paddingLeft: theme.spacing(2),
        },
    },
}));

const Select = withStyles((theme: Theme) => ({
    root: {
        minWidth: theme.spacing(30),
    },
}))(UnstyledSelect);

const FullPlayerContainer = withStyles((theme: Theme) => {
    const transportControlsWidth = theme.spacing(36);

    return {
        root: {
            backgroundColor: "white",
            minWidth: "50vw",
            maxWidth: transportControlsWidth,
            ...roundedTopCornersStyle(theme),
        },
    };
})(Box);

interface MultiTrackPlayerProps {
    show: boolean;

    tracklistLoad: TrackListLoad;
    playerControls: PlayerControls;

    currentTrackIndex: number;
    onSelectCurrentTrack: (index: number) => void;

    onOpenTrackEditDialog?: PlainFn;
    onMinimize: PlainFn;
    onRefresh: PlainFn;
}

const MultiTrackPlayer: React.FC<MultiTrackPlayerProps> = (
    props: MultiTrackPlayerProps
): JSX.Element => {
    const paddingLeftStyle = usePaddingLeftStyle();
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();

    {
        const show = props.show;
        const onMinimize = props.onMinimize;
        useEffect(() => {
            if (!show) {
                return;
            }

            const handleKey = (event: KeyboardEvent) => {
                if (event.code !== "Slash") {
                    return;
                }

                onMinimize();
                event.preventDefault();
            };

            addTopKeyListener(handleKey);
            return () => removeKeyListener(handleKey);
        }, [addTopKeyListener, removeKeyListener, onMinimize, show]);
    }

    const trackListEditButton = props.onOpenTrackEditDialog !== undefined && (
        <TitleBarButton onClick={props.onOpenTrackEditDialog}>
            <EditIcon />
        </TitleBarButton>
    );

    const trackRefreshButton = (
        <TitleBarButton onClick={props.onRefresh}>
            <RefreshIcon />
        </TitleBarButton>
    );

    const trackChangeHandler = (
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>
    ) => {
        const value: unknown = event.target.value;
        if (typeof value !== "number") {
            console.error(
                "Unexpected! Selected value in full size player selector is not a number type"
            );
            return;
        }

        props.onSelectCurrentTrack(value);
    };

    const trackListPicker = (() => {
        const items = (() => {
            if (props.tracklistLoad.state !== "loaded") {
                return undefined;
            }

            return props.tracklistLoad.tracklist.tracks.map(
                (track: Track, index: number) => (
                    <MenuItem key={`${index}-${track.label}`} value={index}>
                        {track.label}
                    </MenuItem>
                )
            );
        })();

        return (
            <Select
                className={paddingLeftStyle.root}
                disableUnderline
                value={props.currentTrackIndex}
                onChange={trackChangeHandler}
            >
                {items}
            </Select>
        );
    })();

    const titleBar = (
        <TitleBar>
            <Box />
            <FlexBox>
                {trackRefreshButton}
                {trackListEditButton}
                {trackListPicker}
            </FlexBox>
            <Box>
                <TitleBarButton onClick={props.onMinimize}>
                    <CollapseDownIcon />
                </TitleBarButton>
            </Box>
        </TitleBar>
    );

    const internalContent: React.ReactNode = (() => {
        if (props.tracklistLoad.state === "loading") {
            return <WaitingSpinner />;
        }

        const tracklistID = props.tracklistLoad.tracklist.song_id;

        const makePlayer = (track: Track, index: number) => {
            const isCurrentTrack = index === props.currentTrackIndex;
            const focused = isCurrentTrack && props.show;
            const playerControls = isCurrentTrack
                ? props.playerControls
                : unfocusedControls;

            return (
                <TrackPlayer
                    key={`${index}-${track.id}`}
                    focused={focused}
                    isCurrentTrack={isCurrentTrack}
                    tracklistID={tracklistID}
                    trackID={track.id}
                    playerControls={playerControls}
                />
            );
        };

        return props.tracklistLoad.tracklist.tracks.map(makePlayer);
    })();

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <FullPlayerContainer>
                    {titleBar}
                    <Divider />
                    {internalContent}
                </FullPlayerContainer>
            )}
        </Slide>
    );
};

export default MultiTrackPlayer;
