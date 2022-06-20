import JumpForwardIcon from "@mui/icons-material/FastForward";
import JumpBackIcon from "@mui/icons-material/FastRewind";
import PauseIcon from "@mui/icons-material/Pause";
import PlayIcon from "@mui/icons-material/PlayArrow";
import RadioIcon from "@mui/icons-material/Radio";
import { Button, Slide, Theme, Tooltip } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { PlainFn } from "common/PlainFn";
import { MUIStyledProps } from "common/styledProps";
import { useRegisterTopKeyListener } from "components/GlobalKeyListener";
import {
    roundedTopCornersStyle,
    withBottomRightBox,
} from "components/track_player/common";
import React, { useEffect, useState } from "react";

interface MicroPlayerProps extends MUIStyledProps {
    show: boolean;
    playersLoaded: boolean;
    disabled?: boolean;
    tooltipMessage: string;
    playing: boolean;
    togglePlay: PlainFn;
    jumpBack: PlainFn;
    jumpForward: PlainFn;
    onClick: () => void;
    sx?: SystemStyleObject<Theme>;
}

const MicroPlayer: React.FC<MicroPlayerProps> = (
    props: MicroPlayerProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();
    const [tempJumpIcon, setTempJumpIcon] = useState<"back" | "forward" | null>(
        null
    );

    {
        const { show, onClick, togglePlay, jumpBack, jumpForward } = props;

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
                    case "Enter":
                    case "Space": {
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

        if (!props.playing) {
            return <PauseIcon sx={{ color: "secondary.main" }} />;
        }

        return <PlayIcon sx={{ color: "primary.main" }} />;
    })();

    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                // span inserted to workaround disabled elements with tooltip
                // https://material-ui.com/components/tooltips/#disabled-elements
                <Tooltip title={props.tooltipMessage}>
                    <span>
                        <Button
                            className={props.className}
                            onClick={props.onClick}
                            disabled={props.disabled}
                            sx={(theme: Theme) => ({
                                ...roundedTopCornersStyle(theme),
                                ...props.sx,
                            })}
                        >
                            {icon}
                        </Button>
                    </span>
                </Tooltip>
            )}
        </Slide>
    );
};

export default React.memo(MicroPlayer);
