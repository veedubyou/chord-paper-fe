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
import { Track } from "../../common/ChordModel/Track";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    withBottomRightBox,
} from "./common";

interface FullSizedPlayerProps {
    show: boolean;
    playing: boolean;
    currentTrackIndex: number;
    trackList: Track[];
    onCollapse: () => void;
    onPlay: () => void;
    onPause: () => void;
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

    const players = props.trackList.map((track: Track, index: number) => {
        const focused = index === props.currentTrackIndex;

        return (
            <Collapse in={focused} key={track.url}>
                <Box>
                    <ReactPlayer
                        key={track.url}
                        url={track.url}
                        playing={focused && props.playing}
                        controls
                        onPlay={props.onPlay}
                        onPause={props.onPause}
                        width="50vw"
                        height="auto"
                        config={{ file: { forceAudio: true } }}
                    />
                </Box>
            </Collapse>
        );
    });

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
            {props.trackList.map((track: Track, index: number) => (
                <MenuItem value={index}>{track.label}</MenuItem>
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
