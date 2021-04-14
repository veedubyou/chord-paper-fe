import { Button as UnstyledButton, Theme, Tooltip } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import DecreasePlayrateIcon from "@material-ui/icons/ArrowDropDown";
import IncreasePlayrateIcon from "@material-ui/icons/ArrowDropUp";
import PauseIcon from "@material-ui/icons/Pause";
import PlayIcon from "@material-ui/icons/PlayArrow";
import JumpBackIcon from "@material-ui/icons/Replay";
import SkipForwardIcon from "@material-ui/icons/SkipNext";
import SkipBackIcon from "@material-ui/icons/SkipPrevious";
import { withStyles } from "@material-ui/styles";
import React from "react";
import BeginningIcon from "./BeginningIcon";
import { roundedCornersStyle } from "./common";
import JumpForwardIcon from "./ForwardIcon";

const Button = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(UnstyledButton);

const PrimaryButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(Button);

const SecondaryButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.main,
    },
}))(Button);

const makeControlButton = (
    child: React.ReactElement,
    key: string,
    tooltipMsg: string,
    color: "primary" | "secondary"
): React.FC<ButtonProps> => {
    const ColoredButton = color === "primary" ? PrimaryButton : SecondaryButton;

    return (props: ButtonProps) => (
        <Tooltip key={key} title={tooltipMsg}>
            <span>
                <ColoredButton {...props} size="large">
                    {child}
                </ColoredButton>
            </span>
        </Tooltip>
    );
};

export const ControlButton = {
    Play: makeControlButton(
        <PlayIcon />,
        "play-button",
        "Play the damn song",
        "primary"
    ),
    Pause: makeControlButton(
        <PauseIcon />,
        "pause-button",
        "Pause",
        "secondary"
    ),
    JumpBack: makeControlButton(
        <JumpBackIcon />,
        "jump-back-buttonn",
        "Jump Back",
        "primary"
    ),
    JumpForward: makeControlButton(
        <JumpForwardIcon />,
        "jump-forward-button",
        "Jump Forward",
        "primary"
    ),
    SkipBack: makeControlButton(
        <SkipBackIcon />,
        "skip-back-button",
        "Go back a section",
        "primary"
    ),
    SkipForward: makeControlButton(
        <SkipForwardIcon />,
        "skip-back-button",
        "Go forward a section",
        "primary"
    ),
    Beginning: makeControlButton(
        <BeginningIcon />,
        "beginning-button",
        "Go to Beginning",
        "primary"
    ),
    DecreasePlayrate: makeControlButton(
        <DecreasePlayrateIcon />,
        "decrease-playrate-button",
        "Play slower",
        "primary"
    ),
    IncreasePlayrate: makeControlButton(
        <IncreasePlayrateIcon />,
        "increase-playrate-button",
        "Play faster",
        "primary"
    ),
};
