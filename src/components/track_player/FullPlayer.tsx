import {
    Box,
    Button,
    Collapse,
    Divider,
    LinearProgress,
    MenuItem,
    Select as UnstyledSelect,
    Slide,
    Theme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CollapseDownIcon from "@material-ui/icons/ExpandMore";
import { makeStyles, withStyles } from "@material-ui/styles";
import React from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import {
    controlPaneStyle,
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import PlayrateControl from "./PlayrateControl";
import SectionLabel from "./SectionLabel";
import { TrackControl } from "./internal_player/usePlayer";

interface FullPlayerProps {
    show: boolean;
    trackControls: TrackControl[];
    playrate: number;
    currentSectionLabel: string;
    onPlayrateChange: (newPlayrate: number) => void;
    onCollapse: () => void;
    onSelectCurrentTrack: (index: number) => void;
    onOpenTrackEditDialog?: () => void;
}

const FlexBox = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        margin: theme.spacing(0.5),
    },
}))(Box);

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(3),
    },
}))(Box);

const TitleBarButton = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(Button);

const ControlPane = withStyles({
    root: {
        ...controlPaneStyle,
        justifyContent: "space-between",
    },
})(Box);

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

const FullPlayer: React.FC<FullPlayerProps> = (
    props: FullPlayerProps
): JSX.Element => {
    const paddingLeftStyle = usePaddingLeftStyle();

    const makeControlPane = (trackControl: TrackControl) => {
        const playPauseButton = trackControl.playing ? (
            <ControlButton.Pause onClick={trackControl.pause} />
        ) : (
            <ControlButton.Play onClick={trackControl.play} />
        );

        return (
            <ControlPane>
                <ControlGroup>
                    <ControlButton.Beginning
                        onClick={trackControl.goToBeginning}
                    />
                    <ControlButton.SkipBack
                        disabled={!trackControl.skipBack.enabled}
                        onClick={trackControl.skipBack.action}
                    />
                    <ControlButton.JumpBack onClick={trackControl.jumpBack} />
                    {playPauseButton}
                    <ControlButton.JumpForward
                        onClick={trackControl.jumpForward}
                    />
                    <ControlButton.SkipForward
                        disabled={!trackControl.skipForward.enabled}
                        onClick={trackControl.skipForward.action}
                    />
                </ControlGroup>
                <SectionLabel value={props.currentSectionLabel} />
                <PlayrateControl
                    playrate={props.playrate}
                    onChange={props.onPlayrateChange}
                />
            </ControlPane>
        );
    };

    const playbackRate = props.playrate / 100;

    const makePlayer = (trackControl: TrackControl, index: number) => {
        const handleProgress = (state: {
            played: number;
            playedSeconds: number;
            loaded: number;
            loadedSeconds: number;
        }) => {
            trackControl.onProgress(state.playedSeconds);
        };

        const commonReactPlayerProps: ReactPlayerProps = {
            ref: trackControl.ref,
            playing: trackControl.playing,
            controls: true,
            playbackRate: playbackRate,
            onPlay: trackControl.onPlay,
            onPause: trackControl.onPause,
            onProgress: handleProgress,
            progressInterval: 500,
            width: "50vw",
            height: "auto",
            config: { file: { forceAudio: true } },
        };

        switch (trackControl.trackType) {
            case "single": {
                return (
                    <Collapse in={trackControl.focused} key={trackControl.url}>
                        <Box>
                            <ReactPlayer
                                {...commonReactPlayerProps}
                                url={trackControl.url}
                            />
                        </Box>
                        {makeControlPane(trackControl)}
                    </Collapse>
                );
            }

            case "4stems": {
                return (
                    <Collapse
                        in={trackControl.focused}
                        key={`loading-${index}`}
                    >
                        <PaddedBox>
                            <LinearProgress />
                        </PaddedBox>
                    </Collapse>
                );
            }
        }
    };

    const players = props.trackControls.map(makePlayer);

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
                    <MenuItem
                        key={`${index}-${trackControl.label}`}
                        value={index}
                    >
                        {trackControl.label}
                    </MenuItem>
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

export default FullPlayer;
