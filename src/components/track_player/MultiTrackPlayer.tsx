import EditIcon from "@mui/icons-material/Edit";
import CollapseDownIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Button,
    Divider,
    FormControl,
    MenuItem,
    Select as UnstyledSelect,
    SelectChangeEvent,
    Slide,
    styled,
    Theme,
} from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { Track } from "common/ChordModel/tracks/Track";
import { PlainFn } from "common/PlainFn";
import { useRegisterTopKeyListener } from "components/GlobalKeyListener";
import LoadingSpinner from "components/loading/LoadingSpinner";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "components/track_player/common";
import { PlayerControls } from "components/track_player/internal_player/usePlayerControls";
import { TrackListLoad } from "components/track_player/providers/TrackListProvider";
import TrackPlayer from "components/track_player/TrackPlayer";
import React, { useEffect, useState } from "react";

const FlexBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(0.5),
}));

const TitleBarButton = styled(Button)(({ theme }) => ({
    minWidth: 0,
    ...roundedCornersStyle(theme),
}));

const paddingLeftStyle: SystemStyleObject<Theme> = {
    [`& .{selectClasses.select}`]: {
        paddingLeft: 2,
    },
};

const Select = styled(UnstyledSelect)(({ theme }) => ({
    minWidth: theme.spacing(30),
}));

const FullPlayerContainer = styled(Box)(({ theme }) => {
    const transportControlsWidth = theme.spacing(36);

    return {
        backgroundColor: "white",
        minWidth: "50vw",
        maxWidth: transportControlsWidth,
        ...roundedTopCornersStyle(theme),
    };
});

interface MultiTrackPlayerProps {
    show: boolean;

    tracklistLoad: TrackListLoad;
    playerControls: PlayerControls;
    fullScreen?: boolean;

    onOpenTrackEditDialog?: PlainFn;
    onMinimize: PlainFn;
    onRefresh: PlainFn;
}

const MultiTrackPlayer: React.FC<MultiTrackPlayerProps> = (
    props: MultiTrackPlayerProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

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

    const trackChangeHandler = (event: SelectChangeEvent<unknown>) => {
        const value: unknown = event.target.value;
        if (typeof value !== "number") {
            console.error(
                "Unexpected! Selected value in full size player selector is not a number type"
            );
            return;
        }

        setCurrentTrackIndex(value);
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
            <FormControl size="small">
                <Select
                    sx={paddingLeftStyle}
                    value={currentTrackIndex}
                    onChange={trackChangeHandler}
                    MenuProps={{ disableScrollLock: true }}
                >
                    {items}
                </Select>
            </FormControl>
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
            return <LoadingSpinner />;
        }

        const tracklistID = props.tracklistLoad.tracklist.song_id;
        const track = props.tracklistLoad.tracklist.tracks[currentTrackIndex]!;

        return (
            <TrackPlayer
                showing={props.show}
                key={`${currentTrackIndex}-${track.id}`}
                tracklistID={tracklistID}
                trackID={track.id}
                playerControls={props.playerControls}
            />
        );
    })();

    const renderedPlayer = (() => {
        const contents = (
            <>
                {titleBar}
                <Divider />
                {internalContent}
            </>
        );

        if (props.fullScreen === true) {
            return (
                <FullPlayerContainer sx={{ maxWidth: 2000 }}>
                    {contents}
                </FullPlayerContainer>
            );
        }

        return withBottomRightBox(
            <FullPlayerContainer>{contents}</FullPlayerContainer>
        );
    })();

    return (
        <Slide in={props.show} direction="up">
            {renderedPlayer}
        </Slide>
    );
};

export default React.memo(MultiTrackPlayer);
