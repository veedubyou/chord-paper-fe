import { Button as UnstyledButton, Theme, Tooltip } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import UnstyledDecreasePlayrateIcon from "@material-ui/icons/ArrowDropDown";
import UnstyledIncreasePlayrateIcon from "@material-ui/icons/ArrowDropUp";
import UnstyledPauseIcon from "@material-ui/icons/Pause";
import UnstyledPlayIcon from "@material-ui/icons/PlayArrow";
import UnstyledJumpBackIcon from "@material-ui/icons/Replay";
import UnstyledSkipBackIcon from "@material-ui/icons/SkipPrevious";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { roundedCornersStyle } from "./common";
import UnstyledJumpForwardIcon from "./ForwardIcon";

const Button = withStyles((theme: Theme) => ({
    root: {
        minWidth: 0,
        ...roundedCornersStyle(theme),
    },
}))(UnstyledButton);

const mainPalette = (theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
});

const secondaryPalette = (theme: Theme) => ({
    root: {
        color: theme.palette.secondary.main,
    },
});

const makeControlButton = (
    child: React.ReactElement,
    tooltipMsg: string
): React.FC<ButtonProps> => {
    return (props: ButtonProps) => (
        <Tooltip title={tooltipMsg}>
            <Button {...props} size="small">
                <Button size="small">{child}</Button>
            </Button>
        </Tooltip>
    );
};

const ControlIcons = {
    Play: withStyles(mainPalette)(UnstyledPlayIcon),
    Pause: withStyles(secondaryPalette)(UnstyledPauseIcon),
    JumpBack: withStyles(mainPalette)(UnstyledJumpBackIcon),
    JumpForward: withStyles(mainPalette)(UnstyledJumpForwardIcon),
    SkipBack: withStyles(mainPalette)(UnstyledSkipBackIcon),
    DecreasePlayrate: withStyles(mainPalette)(UnstyledDecreasePlayrateIcon),
    IncreasePlayrate: withStyles(mainPalette)(UnstyledIncreasePlayrateIcon),
};

export const ControlButton = {
    Play: makeControlButton(<ControlIcons.Play />, "Play the damn song"),
    Pause: makeControlButton(<ControlIcons.Pause />, "Pause"),
    JumpBack: makeControlButton(<ControlIcons.JumpBack />, "Jump Back"),
    JumpForward: makeControlButton(
        <ControlIcons.JumpForward />,
        "Jump Forward"
    ),
    SkipBack: makeControlButton(<ControlIcons.SkipBack />, "Go to Beginning"),
    DecreasePlayrate: makeControlButton(
        <ControlIcons.DecreasePlayrate />,
        "Play slower"
    ),
    IncreasePlayrate: makeControlButton(
        <ControlIcons.IncreasePlayrate />,
        "Play faster"
    ),
};
