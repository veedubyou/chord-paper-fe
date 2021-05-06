import {
    Box,
    Button,
    CircularProgress,
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
import React, { useRef } from "react";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track } from "../../common/ChordModel/tracks/Track";
import { PlainFn } from "../../common/PlainFn";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import { TrackListLoad } from "./TrackListProvider";
import TrackPlayer, { Refreshable } from "./TrackPlayer";

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

const FullPlayerContainer = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: "white",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

interface MultiTrackPlayerProps {
    show: boolean;

    tracklistLoad: TrackListLoad;
    readonly timeSections: TimeSection[];

    currentTrackIndex: number;
    onSelectCurrentTrack: (index: number) => void;

    onOpenTrackEditDialog?: PlainFn;
    onMinimize: PlainFn;
}

const MultiTrackPlayer: React.FC<MultiTrackPlayerProps> = (
    props: MultiTrackPlayerProps
): JSX.Element => {
    const paddingLeftStyle = usePaddingLeftStyle();
    const refreshActionRef = useRef<Refreshable | null>(null);

    const trackListEditButton = props.onOpenTrackEditDialog !== undefined && (
        <TitleBarButton onClick={props.onOpenTrackEditDialog}>
            <EditIcon />
        </TitleBarButton>
    );

    const refresh = () => refreshActionRef.current?.refresh();

    const trackRefreshButton = (
        <TitleBarButton onClick={refresh}>
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
            return <CircularProgress />;
        }

        const makePlayer = (track: Track, index: number) => {
            const currentTrack = index === props.currentTrackIndex;
            const show = currentTrack && props.show;
            const ref = currentTrack ? refreshActionRef : undefined;

            return (
                <TrackPlayer
                    key={`${index}-${track.id}`}
                    refreshRef={ref}
                    show={show}
                    currentTrack={currentTrack}
                    track={track}
                    timeSections={props.timeSections}
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
