import { Box, styled } from "@mui/material";
import React, { useEffect } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { useRegisterTopKeyListener } from "../../GlobalKeyListener";
import { controlPaneStyle } from "../common";
import { ControlButton } from "./ControlButton";
import ControlGroup, { ControlGroupBox } from "./ControlGroup";
import SectionLabel from "./SectionLabel";
import AdvancedControls from "./advanced_controls/AdvancedControls";
import { ButtonActionAndState } from "./usePlayerControls";

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
    transpose?: {
        level: number;
        onChange: (newLevel: number) => void;
    };
    sectionLabel: string;
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
            <SectionLabel value={props.sectionLabel} />
            <RightJustifiedControlBox>
                <AdvancedControls
                    tempo={props.tempo}
                    transpose={props.transpose}
                />
            </RightJustifiedControlBox>
        </ControlPaneBox>
    );
};

export default ControlPane;
