import {
    Box,
    Button,
    Collapse,
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
import ReactPlayer from "react-player";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    withBottomRightBox,
} from "./common";
import { TrackControl } from "./useMultiTrack";

interface FullSizedPlayerProps {
    show: boolean;
    trackControls: TrackControl[];
    onCollapse: () => void;
    onSelectCurrentTrack: (index: number) => void;
    onOpenTrackEditDialog?: () => void;
}

const TitleBar = withStyles((theme: Theme) => ({
    root: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

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

const FullSizedPlayer: React.FC<FullSizedPlayerProps> = (
    props: FullSizedPlayerProps
): JSX.Element => {
    const paddingLeftStyle = usePaddingLeftStyle();

    const players = props.trackControls.map(
        (trackControl: TrackControl, index: number) => {
            const handleProgress = (state: {
                played: number;
                playedSeconds: number;
                loaded: number;
                loadedSeconds: number;
            }) => {
                trackControl.onProgress(state.playedSeconds);
            };

            return (
                <Collapse in={trackControl.focused} key={trackControl.url}>
                    <Box>
                        <ReactPlayer
                            ref={trackControl.ref}
                            url={trackControl.url}
                            playing={trackControl.playing}
                            controls
                            onPlay={trackControl.onPlay}
                            onPause={trackControl.onPause}
                            onProgress={handleProgress}
                            width="50vw"
                            height="auto"
                            config={{ file: { forceAudio: true } }}
                        />
                    </Box>
                </Collapse>
            );
        }
    );

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

    const currentIndex: number = props.trackControls.findIndex(
        (trackControl: TrackControl) => trackControl.focused
    );

    const trackListPicker = (
        <Select
            className={paddingLeftStyle.root}
            disableUnderline
            value={currentIndex}
            onChange={trackChangeHandler}
        >
            {props.trackControls.map(
                (trackControl: TrackControl, index: number) => (
                    <MenuItem value={index}>{trackControl.label}</MenuItem>
                )
            )}
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

export default FullSizedPlayer;
