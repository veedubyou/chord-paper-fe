import { Button as UnstyledButton, Theme, Tooltip } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import DecreasePlayrateIcon from "@material-ui/icons/ArrowDropDown";
import IncreasePlayrateIcon from "@material-ui/icons/ArrowDropUp";
import PauseIcon from "@material-ui/icons/Pause";
import PlayIcon from "@material-ui/icons/PlayArrow";
import JumpBackIcon from "@material-ui/icons/Replay";
import SkipBackIcon from "@material-ui/icons/SkipPrevious";
import { withStyles } from "@material-ui/styles";
import React from "react";
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
    tooltipMsg: string,
    color: "primary" | "secondary"
): React.FC<ButtonProps> => {
    const ColoredButton = color === "primary" ? PrimaryButton : SecondaryButton;

    return (props: ButtonProps) => (
        <Tooltip title={tooltipMsg}>
            <ColoredButton {...props} size="small">
                <ColoredButton disabled={props.disabled} size="small">
                    {child}
                </ColoredButton>
            </ColoredButton>
        </Tooltip>
    );
};

export const ControlButton = {
    Play: makeControlButton(<PlayIcon />, "Play the damn song", "primary"),
    Pause: makeControlButton(<PauseIcon />, "Pause", "secondary"),
    JumpBack: makeControlButton(<JumpBackIcon />, "Jump Back", "primary"),
    JumpForward: makeControlButton(
        <JumpForwardIcon />,
        "Jump Forward",
        "primary"
    ),
    SkipBack: makeControlButton(<SkipBackIcon />, "Go to Beginning", "primary"),
    DecreasePlayrate: makeControlButton(
        <DecreasePlayrateIcon />,
        "Play slower",
        "primary"
    ),
    IncreasePlayrate: makeControlButton(
        <IncreasePlayrateIcon />,
        "Play faster",
        "primary"
    ),
};
