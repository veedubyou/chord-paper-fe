import {
    Box,
    Button as UnstyledButton,
    Divider,
    Slide,
    Theme,
    Typography,
} from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";
import ExpandIcon from "@material-ui/icons/Launch";
import MinimizeIcon from "@material-ui/icons/Minimize";
import UnstyledReplayIcon from "@material-ui/icons/Replay";
import { ButtonProps } from "@material-ui/core/Button";

import UnstyledPauseIcon from "@material-ui/icons/Pause";
import UnstyledPlayIcon from "@material-ui/icons/PlayArrow";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { PlainFn } from "../../common/PlainFn";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";

interface CompactPlayerProps {
    show: boolean;
    playing: boolean;
    onMaximize: PlainFn;
    onMinimize: PlainFn;
    currentTime: string;
    onPlay: PlainFn;
    onPause: PlainFn;
    onJumpBack: PlainFn;
}

const PlayerBody = withStyles({
    root: {
        backgroundColor: blueGrey[50],
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    },
})(Box);

const ButtonGroup = withStyles((theme: Theme) => ({
    root: {
        borderStyle: "solid",
        borderColor: blueGrey[100],
        borderLeftWidth: theme.spacing(0.25),
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        display: "flex",
        alignContent: "center",
    },
}))(Box);

const TimeDisplay = withStyles((theme: Theme) => ({
    root: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))(Box);

const JumpBackIcon = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(UnstyledReplayIcon);

const PlayIcon = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(UnstyledPlayIcon);

const PauseIcon = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.main,
    },
}))(UnstyledPauseIcon);

const Button = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(UnstyledButton);

const PlayerContainer = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: "white",
        minWidth: "15vw",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

const CoolAssButton: React.FC<ButtonProps> = (props: ButtonProps) => {
    return (
        <Button {...props} size="small">
            <Button size="small">{props.children}</Button>
        </Button>
    );
};

const CompactPlayer: React.FC<CompactPlayerProps> = (
    props: CompactPlayerProps
): JSX.Element => {
    const titleBar = (
        <TitleBar>
            <Box />
            <Box>
                <Button onClick={props.onMinimize} size="small">
                    <MinimizeIcon />
                </Button>
                <Button onClick={props.onMaximize} size="small">
                    <ExpandIcon />
                </Button>
            </Box>
        </TitleBar>
    );

    const playPauseButton = props.playing ? (
        <CoolAssButton onClick={props.onPause}>
            <PauseIcon />
        </CoolAssButton>
    ) : (
        <CoolAssButton onClick={props.onPlay}>
            <PlayIcon />
        </CoolAssButton>
    );

    const controlPanel = (
        <PlayerBody>
            <TimeDisplay>
                <Typography variant="h6">{props.currentTime}</Typography>
            </TimeDisplay>

            <ButtonGroup>
                <CoolAssButton onClick={props.onJumpBack}>
                    <JumpBackIcon />
                </CoolAssButton>

                {playPauseButton}
            </ButtonGroup>
        </PlayerBody>
    );

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <PlayerContainer>
                    {titleBar}
                    <Divider />
                    {controlPanel}
                </PlayerContainer>
            )}
        </Slide>
    );
};

export default CompactPlayer;
