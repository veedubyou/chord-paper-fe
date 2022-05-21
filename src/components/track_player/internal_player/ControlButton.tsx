import DecreaseIcon from "@mui/icons-material/ArrowDropDown";
import IncreaseIcon from "@mui/icons-material/ArrowDropUp";
import PauseIcon from "@mui/icons-material/Pause";
import PlayIcon from "@mui/icons-material/PlayArrow";
import JumpBackIcon from "@mui/icons-material/Replay";
import SkipForwardIcon from "@mui/icons-material/SkipNext";
import SkipBackIcon from "@mui/icons-material/SkipPrevious";
import { Button as UnstyledButton, styled, Tooltip } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import React from "react";
import { roundedCornersStyle } from "../common";
import BeginningIcon from "./BeginningIcon";
import JumpForwardIcon from "./ForwardIcon";
import SharpFlatIcon from "./SharpFlatIcon";

const Button = styled(UnstyledButton)(({ theme }) => ({
    minWidth: 0,
    ...roundedCornersStyle(theme),
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.main,
}));

const makeControlButton = (
    child: React.ReactElement,
    key: string,
    tooltipMsg: string,
    color: "primary" | "secondary"
): React.FC<ButtonProps> => {
    const ColoredButton = color === "primary" ? PrimaryButton : SecondaryButton;

    // the keyboard usage of the player collides with any keyboard triggers of control buttons
    // so disable them entirely, which may happen through keyups
    const preventKeyInvocation = (
        event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (props: ButtonProps) => (
        // <Tooltip key={key} title={tooltipMsg}>
        //     <span>
        <ColoredButton {...props} onKeyUp={preventKeyInvocation} size="large">
            {child}
        </ColoredButton>
        //     </span>
        // </Tooltip>
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
        <DecreaseIcon />,
        "decrease-playrate-button",
        "Play slower",
        "primary"
    ),
    IncreasePlayrate: makeControlButton(
        <IncreaseIcon />,
        "increase-playrate-button",
        "Play faster",
        "primary"
    ),
    TogglePlayrateMenu: makeControlButton(
        <SharpFlatIcon />,
        "toggle-playrate-menu",
        "Open tempo",
        "primary"
    ),
    TransposeDown: makeControlButton(
        <DecreaseIcon />,
        "transpose-down-button",
        "Transpose down half step",
        "primary"
    ),
    TransposeUp: makeControlButton(
        <IncreaseIcon />,
        "transpose-up-button",
        "Transpose up half step",
        "primary"
    ),
    CloseMenu: makeControlButton(<CloseIcon />, "", "Close Menu", "primary"),
};
