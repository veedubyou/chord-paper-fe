import { Box, styled } from "@mui/material";
import { PlainFn } from "common/PlainFn";
import { useRegisterTopKeyListener } from "components/GlobalKeyListener";
import { controlPaneStyle } from "components/track_player/common";
import { ABLoop } from "components/track_player/internal_player/ABLoop";
import AdvancedControls from "components/track_player/internal_player/advanced_controls/AdvancedControls";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import ControlGroup, {
    ControlGroupBox
} from "components/track_player/internal_player/ControlGroup";
import { ButtonActionAndState } from "components/track_player/internal_player/usePlayerControls";
import React, { useEffect } from "react";

interface ControlPaneProps {
    show: boolean;
    playing: boolean;
    onTogglePlay: PlainFn;
    onJumpBack: PlainFn;
    onJumpForward: PlainFn;
    onGoToBeginning: PlainFn;
    onSkipBack: ButtonActionAndState;
    onSkipForward: ButtonActionAndState;
    tempo: {
        percentage: number;
        onChange: (newPercentage: number) => void;
    };
    abLoop: {
        abLoop: ABLoop;
        onChange: (newABLoop: ABLoop) => void;
    };
    transpose?: {
        level: number;
        onChange: (newLevel: number) => void;
    };
}

const RightJustifiedControlBox = styled(ControlGroupBox)({
    marginLeft: "auto",
});

export const ControlPaneBox = styled(Box)(({ theme }) => {
    const buttonHeight = theme.spacing(5);
    return {
        ...controlPaneStyle,
        justifyContent: "space-between",
        // these series of CSS allows flex items
        // to be "pushed off" when they run out of space
        flexWrap: "wrap",
        overflow: "hidden",
        maxHeight: buttonHeight,
    };
});

const ControlPane: React.FC<ControlPaneProps> = (
    props: ControlPaneProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();

    const playPauseButton = props.playing ? (
        <ControlButton.Pause onClick={props.onTogglePlay} />
    ) : (
        <ControlButton.Play onClick={props.onTogglePlay} />
    );

    useEffect(() => {
        if (!props.show) {
            return;
        }

        const handleKey = (event: KeyboardEvent) => {
            switch (event.code) {
                case "Space": {
                    props.onTogglePlay();
                    event.preventDefault();

                    break;
                }
                case "ArrowLeft": {
                    if (event.ctrlKey || event.metaKey) {
                        props.onSkipBack.action();
                    } else {
                        props.onJumpBack();
                    }

                    event.preventDefault();
                    break;
                }
                case "ArrowRight": {
                    if (event.ctrlKey || event.metaKey) {
                        props.onSkipForward.action();
                    } else {
                        props.onJumpForward();
                    }

                    event.preventDefault();
                    return;
                }
            }
        };

        addTopKeyListener(handleKey);
        return () => {
            removeKeyListener(handleKey);
        };
    }, [props, addTopKeyListener, removeKeyListener]);

    return (
        <ControlPaneBox>
            <ControlGroup dividers="right">
                <ControlButton.Beginning onClick={props.onGoToBeginning} />
                <ControlButton.SkipBack
                    disabled={!props.onSkipBack.enabled}
                    onClick={props.onSkipBack.action}
                />
                <ControlButton.JumpBack onClick={props.onJumpBack} />
                {playPauseButton}
                <ControlButton.JumpForward onClick={props.onJumpForward} />
                <ControlButton.SkipForward
                    disabled={!props.onSkipForward.enabled}
                    onClick={props.onSkipForward.action}
                />
            </ControlGroup>
            <RightJustifiedControlBox>
                <AdvancedControls
                    tempo={props.tempo}
                    abLoop={props.abLoop}
                    transpose={props.transpose}
                />
            </RightJustifiedControlBox>
        </ControlPaneBox>
    );
};

export default ControlPane;
