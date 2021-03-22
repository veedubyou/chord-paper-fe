import {
    Box,
    Button as UnstyledButton,
    Divider,
    Slide,
    Theme,
    Typography,
} from "@material-ui/core";
import ExpandIcon from "@material-ui/icons/Launch";
import MinimizeIcon from "@material-ui/icons/Minimize";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { PlainFn } from "../../common/PlainFn";
import {
    controlPaneStyle,
    greyTextColour,
    widthOfString,
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import { ButtonActionAndState } from "./useMultiTrack";

interface CompactPlayerProps {
    show: boolean;
    playing: boolean;
    onMaximize: PlainFn;
    onMinimize: PlainFn;
    currentTime: string;
    play: PlainFn;
    pause: PlainFn;
    jumpBack: PlainFn;
    skipBack: ButtonActionAndState;
}

const TimeDisplay = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: widthOfString(theme, "h6", "00:00"),
        color: greyTextColour,
    },
}))(Box);

const Button = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(UnstyledButton);

const PlayerContainer = withStyles((theme: Theme) => ({
    root: {
        backgroundColor: "white",
        ...roundedTopCornersStyle(theme),
    },
}))(Box);

const ControlPane = withStyles({ root: controlPaneStyle })(Box);

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
        <ControlButton.Pause onClick={props.pause} />
    ) : (
        <ControlButton.Play onClick={props.play} />
    );

    const controlPane = (
        <ControlPane>
            <ControlGroup>
                <ControlButton.SkipBack
                    disabled={!props.skipBack.enabled}
                    onClick={props.skipBack.action}
                />
                <ControlButton.JumpBack onClick={props.jumpBack} />
                {playPauseButton}
            </ControlGroup>
            <TimeDisplay>
                <Box>
                    <Typography variant="h6">{props.currentTime}</Typography>
                </Box>
            </TimeDisplay>
        </ControlPane>
    );

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <PlayerContainer>
                    {titleBar}
                    <Divider />
                    {controlPane}
                </PlayerContainer>
            )}
        </Slide>
    );
};

export default CompactPlayer;
