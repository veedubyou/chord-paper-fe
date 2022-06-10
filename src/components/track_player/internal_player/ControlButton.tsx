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
import ABLoopIcon from "components/icons/ABLoopIcon";
import AIcon from "components/icons/AIcon";
import BeginningIcon from "components/icons/BeginningIcon";
import FlatIcon from "components/icons/FlatIcon";
import FlatSharpIcon from "components/icons/FlatSharpIcon";
import JumpForwardIcon from "components/icons/ForwardIcon";
import MetronomeIcon from "components/icons/MetronomeIcon";
import SharpIcon from "components/icons/SharpIcon";
import { roundedCornersStyle } from "components/track_player/common";
import React from "react";

const Button = styled(UnstyledButton)(({ theme }) => ({
    minWidth: 0,
    ...roundedCornersStyle(theme),
}));

const makeControlButton = (
    child: React.ReactElement,
    key: string,
    tooltipMsg: string,
    color: "primary.main" | "secondary.main" | "action.active"
): React.FC<ButtonProps> => {
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
                    onKeyUp={preventKeyInvocation}
                    size="large"
                    sx={{ color: color }}
                    {...props}
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
        "primary.main"
    ),
    Pause: makeControlButton(
        <PauseIcon />,
        "pause-button",
        "Pause",
        "secondary.main"
    ),
    JumpBack: makeControlButton(
        <JumpBackIcon />,
        "jump-back-buttonn",
        "Jump Back",
        "primary.main"
    ),
    JumpForward: makeControlButton(
        <JumpForwardIcon />,
        "jump-forward-button",
        "Jump Forward",
        "primary.main"
    ),
    SkipBack: makeControlButton(
        <SkipBackIcon />,
        "skip-back-button",
        "Go back a section",
        "primary.main"
    ),
    SkipForward: makeControlButton(
        <SkipForwardIcon />,
        "skip-back-button",
        "Go forward a section",
        "primary.main"
    ),
    Beginning: makeControlButton(
        <BeginningIcon />,
        "beginning-button",
        "Go to Beginning",
        "primary.main"
    ),
    DecreaseTempo: makeControlButton(
        <DecreaseIcon />,
        "decrease-tempo-button",
        "Play slower",
        "primary.main"
    ),
    IncreaseTempo: makeControlButton(
        <IncreaseIcon />,
        "increase-tempo-button",
        "Play faster",
        "primary.main"
    ),
    TempoMenu: makeControlButton(
        <MetronomeIcon />,
        "tempo-menu",
        "Change tempo",
        "primary.main"
    ),
    ABLoopMenu: makeControlButton(
        <ABLoopIcon />,
        "ab-loop-menu",
        "Set AB Loop",
        "primary.main"
    ),
    TransposeMenu: makeControlButton(
        <FlatSharpIcon />,
        "transpose-menu",
        "Change pitch",
        "primary.main"
    ),
    TransposeDown: makeControlButton(
        <FlatIcon />,
        "transpose-down-button",
        "Down half step",
        "primary.main"
    ),
    TransposeUp: makeControlButton(
        <SharpIcon />,
        "transpose-up-button",
        "Up half step",
        "primary.main"
    ),
    CloseMenu: makeControlButton(
        <CloseIcon />,
        "close-menu",
        "Close Menu",
        "secondary.main"
    ),
    SetPointA: makeControlButton(
        <AIcon />,
        "set-point-a",
        "Set Point A",
        "action.active"
    ),
    ClearPointA: makeControlButton(
        <AIcon />,
        "clear-point-a",
        "Clear Point A",
        "primary.main"
    ),
};
