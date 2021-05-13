import { Button, Slide, Theme, Tooltip } from "@material-ui/core";
import RadioIcon from "@material-ui/icons/Radio";
import { withStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useRegisterTopKeyListener } from "../GlobalKeyListener";
import { roundedTopCornersStyle, withBottomRightBox } from "./common";
import { PlayerControls } from "./internal_player/usePlayerControls";
import UnstyledPlayIcon from "@material-ui/icons/PlayArrow";
import UnstyledPauseIcon from "@material-ui/icons/Pause";
import JumpBackIcon from "@material-ui/icons/FastRewind";
import JumpForwardIcon from "@material-ui/icons/FastForward";

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

const ExpandButton = withStyles((theme: Theme) => ({
    root: {
        ...roundedTopCornersStyle(theme),
    },
}))(Button);

interface MicroPlayerProps {
    show: boolean;
    playersLoaded: boolean;
    disabled?: boolean;
    tooltipMessage: string;
    playerControls: PlayerControls;
    onClick: () => void;
    className?: string;
}

const MicroPlayer: React.FC<MicroPlayerProps> = (
    props: MicroPlayerProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();
    const [tempJumpIcon, setTempJumpIcon] = useState<"back" | "forward" | null>(
        null
    );

    {
        const togglePlay = props.playerControls.togglePlay;
        const jumpBack = props.playerControls.jumpBack;
        const jumpForward = props.playerControls.jumpForward;
        const onClick = props.onClick;
        const show = props.show;

        useEffect(() => {
            if (!show) {
                return;
            }

            const handleKey = (event: KeyboardEvent) => {
                if (event.code === "Slash") {
                    onClick();
                    event.preventDefault();
                }

                // make this only happen when CTRL/CMD is pressed
                // don't want to just fire sporadically without
                // visual feedback
                if (!event.ctrlKey && !event.metaKey) {
                    return;
                }

                switch (event.code) {
                    // because space doesn't work because FUCK MACOS
                    case "Enter": {
                        togglePlay();
                        event.preventDefault();
                        break;
                    }

                    case "ArrowLeft": {
                        jumpBack();
                        setTempJumpIcon("back");
                        event.preventDefault();
                        break;
                    }

                    case "ArrowRight": {
                        jumpForward();
                        setTempJumpIcon("forward");
                        event.preventDefault();
                        break;
                    }
                }
            };

            addTopKeyListener(handleKey);
            return () => removeKeyListener(handleKey);
        }, [
            addTopKeyListener,
            removeKeyListener,
            show,
            onClick,
            togglePlay,
            jumpBack,
            jumpForward,
            setTempJumpIcon,
        ]);
    }

    useEffect(() => {
        if (tempJumpIcon === null) {
            return;
        }

        setTimeout(() => setTempJumpIcon(null), 1000);
    }, [tempJumpIcon, setTempJumpIcon]);

    const icon: React.ReactElement = (() => {
        if (!props.playersLoaded) {
            return <RadioIcon />;
        }

        if (tempJumpIcon === "back") {
            return <JumpBackIcon />;
        }

        if (tempJumpIcon === "forward") {
            return <JumpForwardIcon />;
        }

        if (!props.playerControls.playing) {
            return <PauseIcon />;
        }

        return <PlayIcon />;
    })();

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                // span inserted to workaround disabled elements with tooltip
                // https://material-ui.com/components/tooltips/#disabled-elements
                <Tooltip title={props.tooltipMessage}>
                    <span>
                        <ExpandButton
                            className={props.className}
                            onClick={props.onClick}
                            disabled={props.disabled}
                        >
                            {icon}
                        </ExpandButton>
                    </span>
                </Tooltip>
            )}
        </Slide>
    );
};

export default MicroPlayer;
