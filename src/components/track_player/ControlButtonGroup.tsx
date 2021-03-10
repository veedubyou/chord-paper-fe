import {
    Box,
    Button as UnstyledButton,
    Divider,
    Theme,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import UnstyledPauseIcon from "@material-ui/icons/Pause";
import UnstyledPlayIcon from "@material-ui/icons/PlayArrow";
import UnstyledJumpBackIcon from "@material-ui/icons/Replay";
import UnstyledJumpForwardIcon from "./ForwardIcon";
import UnstyledSkipBackIcon from "@material-ui/icons/SkipPrevious";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { roundedCornersStyle } from "./common";

const ButtonGroupBox = withStyles({
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

const ControlIcons = {
    Play: withStyles(mainPalette)(UnstyledPlayIcon),
    Pause: withStyles(secondaryPalette)(UnstyledPauseIcon),
    JumpBack: withStyles(mainPalette)(UnstyledJumpBackIcon),
    JumpForward: withStyles(mainPalette)(UnstyledJumpForwardIcon),
    SkipBack: withStyles(mainPalette)(UnstyledSkipBackIcon),
};

interface ControlButtonProps {
    onClick: ButtonProps["onClick"];
}

const makeControlButton = (child: React.ReactElement) => {
    return (props: ControlButtonProps) => (
        <Button {...props} size="small">
            <Button size="small">{child}</Button>
        </Button>
    );
};

export const ControlButton = {
    Play: makeControlButton(<ControlIcons.Play />),
    Pause: makeControlButton(<ControlIcons.Pause />),
    JumpBack: makeControlButton(<ControlIcons.JumpBack />),
    JumpForward: makeControlButton(<ControlIcons.JumpForward />),
    SkipBack: makeControlButton(<ControlIcons.SkipBack />),
};

interface ControlButtonGroupProps {
    children: React.ReactElement[];
}

const ControlButtonGroup: React.FC<ControlButtonGroupProps> = (
    props: ControlButtonGroupProps
): JSX.Element => {
    const contents: React.ReactElement[] = props.children.map(
        (child: React.ReactElement) => {
            return (
                <>
                    {child}
                    <VerticalMiddleDivider orientation="vertical" flexItem />
                </>
            );
        }
    );

    return <ButtonGroupBox>{contents}</ButtonGroupBox>;
};

export default ControlButtonGroup;
