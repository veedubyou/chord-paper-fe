import DecreaseIcon from "@mui/icons-material/ArrowDropDown";
import IncreaseIcon from "@mui/icons-material/ArrowDropUp";
import CloseIcon from "@mui/icons-material/Close";
import PauseIcon from "@mui/icons-material/Pause";
import PlayIcon from "@mui/icons-material/PlayArrow";
import JumpBackIcon from "@mui/icons-material/Replay";
import SkipForwardIcon from "@mui/icons-material/SkipNext";
import SkipBackIcon from "@mui/icons-material/SkipPrevious";
import { Button as UnstyledButton, styled, Tooltip } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import React from "react";
import BeginningIcon from "../../icons/BeginningIcon";
import FlatIcon from "../../icons/FlatIcon";
import FlatSharpIcon from "../../icons/FlatSharpIcon";
import JumpForwardIcon from "../../icons/ForwardIcon";
import MetronomeIcon from "../../icons/MetronomeIcon";
import SharpIcon from "../../icons/SharpIcon";
import { roundedCornersStyle } from "../common";

const Button = styled(UnstyledButton)(({ theme }) => ({
    minWidth: 0,
    ...roundedCornersStyle(theme),
}));

const makeControlButton = (
    child: React.ReactElement,
    key: string,
    tooltipMsg: string,
    color: "primary" | "secondary"
): React.FC<ButtonProps> => {
    const buttonColor = color === "primary" ? "primary.main" : "secondary.main";

    // the keyboard usage of the player collides with any keyboard triggers of control buttons
    // so disable them entirely, which may happen through keyups
    const preventKeyInvocation = (
        event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (props: ButtonProps) => (
        <Tooltip key={key} title={tooltipMsg}>
            <span>
                <Button
                    {...props}
                    onKeyUp={preventKeyInvocation}
                    size="large"
                    sx={{ color: buttonColor }}
                >
                    {child}
                </Button>
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
    DecreaseTempo: makeControlButton(
        <DecreaseIcon />,
        "decrease-tempo-button",
        "Play slower",
        "primary"
    ),
    IncreaseTempo: makeControlButton(
        <IncreaseIcon />,
        "increase-tempo-button",
        "Play faster",
        "primary"
    ),
    TempoMenu: makeControlButton(
        <MetronomeIcon />,
        "tempo-menu",
        "Change tempo",
        "primary"
    ),
    TransposeMenu: makeControlButton(
        <FlatSharpIcon />,
        "transpose-menu",
        "Change pitch",
        "primary"
    ),
    TransposeDown: makeControlButton(
        <FlatIcon />,
        "transpose-down-button",
        "Down half step",
        "primary"
    ),
    TransposeUp: makeControlButton(
        <SharpIcon />,
        "transpose-up-button",
        "Up half step",
        "primary"
    ),
    CloseMenu: makeControlButton(
        <CloseIcon />,
        "close-menu",
        "Close Menu",
        "secondary"
    ),
};
