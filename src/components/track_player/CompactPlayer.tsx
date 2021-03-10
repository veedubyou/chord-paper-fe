import {
    Box,
    Button as UnstyledButton,
    Divider,
    Slide,
    Theme,
    Typography,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import ExpandIcon from "@material-ui/icons/Launch";
import MinimizeIcon from "@material-ui/icons/Minimize";

import { withStyles } from "@material-ui/styles";
import React from "react";
import { PlainFn } from "../../common/PlainFn";
import {
    roundedCornersStyle,
    roundedTopCornersStyle,
    TitleBar,
    withBottomRightBox,
} from "./common";
import ControlButtonGroup, { ControlButton } from "./ControlButtonGroup";
import ControlPane from "./ControlPane";

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
        <ControlButton.Pause onClick={props.onPause} />
    ) : (
        <ControlButton.Play onClick={props.onPlay} />
    );

    const controlPane = (
        <ControlPane>
            <ControlButtonGroup>
                <ControlButton.JumpBack onClick={props.onJumpBack} />
                {playPauseButton}
            </ControlButtonGroup>
            <TimeDisplay>
                <Typography variant="h6">{props.currentTime}</Typography>
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
