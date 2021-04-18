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
import { makeStyles, withStyles } from "@material-ui/styles";
import React from "react";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track, TrackList } from "../../common/ChordModel/Track";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import TrackPlayer from "./TrackPlayer";

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

    tracklist: TrackList;
    readonly timeSections: TimeSection[];

    currentTrackIndex: number;
    onSelectCurrentTrack: (index: number) => void;

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;

    onOpenTrackEditDialog?: () => void;
    onCollapse: () => void;
}

const MultiTrackPlayer: React.FC<MultiTrackPlayerProps> = (
    props: MultiTrackPlayerProps
): JSX.Element => {
    const paddingLeftStyle = usePaddingLeftStyle();

    const trackListEditButton = props.onOpenTrackEditDialog !== undefined && (
        <TitleBarButton onClick={props.onOpenTrackEditDialog}>
            <EditIcon />
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

    const trackListPicker = (
        <Select
            className={paddingLeftStyle.root}
            disableUnderline
            value={props.currentTrackIndex}
            onChange={trackChangeHandler}
        >
            {props.tracklist.tracks.map((track: Track, index: number) => (
                <MenuItem key={`${index}-${track.label}`} value={index}>
                    {track.label}
                </MenuItem>
            ))}
        </Select>
    );

    const titleBar = (
        <TitleBar>
            <Box />
            <FlexBox>
                {trackListEditButton}
                {trackListPicker}
            </FlexBox>
            <Box>
                <TitleBarButton onClick={props.onCollapse}>
                    <CollapseDownIcon />
                </TitleBarButton>
            </Box>
        </TitleBar>
    );

    const players: React.ReactElement[] = props.tracklist.tracks.map(
        (track: Track, index: number) => {
            const show = index === props.currentTrackIndex && props.show;
            return (
                <TrackPlayer
                    key={`${index}-${track.label}`}
                    show={show}
                    track={track}
                    timeSections={props.timeSections}
                    playrate={props.playrate}
                    onPlayrateChange={props.onPlayrateChange}
                />
            );
        }
    );

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <FullPlayerContainer>
                    {titleBar}
                    <Divider />
                    {players}
                </FullPlayerContainer>
            )}
        </Slide>
    );
};

export default MultiTrackPlayer;
