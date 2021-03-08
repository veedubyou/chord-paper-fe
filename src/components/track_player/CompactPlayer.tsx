import {
    Box,
    Button as UnstyledButton,
    Divider,
    Slide,
    Theme,
    Typography,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import blueGrey from "@material-ui/core/colors/blueGrey";
import grey from "@material-ui/core/colors/grey";
import ExpandIcon from "@material-ui/icons/Launch";
import MinimizeIcon from "@material-ui/icons/Minimize";
import UnstyledPauseIcon from "@material-ui/icons/Pause";
import UnstyledPlayIcon from "@material-ui/icons/PlayArrow";
import UnstyledReplayIcon from "@material-ui/icons/Replay";
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

const ButtonGroup = withStyles({
    root: {
        display: "flex",
    },
})(Box);

const VerticalMiddleDivider = withStyles((theme: Theme) => ({
    root: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
    },
}))(Divider);

const TimeDisplay = withStyles((theme: Theme) => ({
    root: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: grey[700],
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
            <ButtonGroup>
                <CoolAssButton onClick={props.onJumpBack}>
                    <JumpBackIcon />
                </CoolAssButton>
                <VerticalMiddleDivider orientation="vertical" flexItem />
                {playPauseButton}
                <VerticalMiddleDivider orientation="vertical" flexItem />
            </ButtonGroup>
            <TimeDisplay>
                <Typography variant="h6">{props.currentTime}</Typography>
            </TimeDisplay>
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
