import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { useRegisterTopKeyListener } from "../../GlobalKeyListener";
import { controlPaneStyle } from "../common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import PlayrateControl from "./PlayrateControl";
import SectionLabel from "./SectionLabel";
import { ButtonActionAndState } from "./useTimeControls";

interface ControlPaneProps {
    focused: boolean;
    playing: boolean;
    onPlay: PlainFn;
    onPause: PlainFn;
    onJumpBack: PlainFn;
    onJumpForward: PlainFn;
    onGoToBeginning: PlainFn;
    onSkipBack: ButtonActionAndState;
    onSkipForward: ButtonActionAndState;
    onMinimize: PlainFn;
    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
    sectionLabel: string;
}

const ControlPaneBox = withStyles({
    root: {
        ...controlPaneStyle,
        justifyContent: "space-between",
    },
})(Box);

const ControlPane: React.FC<ControlPaneProps> = (
    props: ControlPaneProps
): JSX.Element => {
    const [addTopKeyListener, removeKeyListener] = useRegisterTopKeyListener();

    const playPauseButton = props.playing ? (
        <ControlButton.Pause onClick={props.onPause} />
    ) : (
        <ControlButton.Play onClick={props.onPlay} />
    );

    useEffect(() => {
        if (!props.focused) {
            return;
        }

        const handleKey = (event: KeyboardEvent) => {
            if (event.target !== document.body) {
                return;
            }

            const stopEvent = () => {
                event.preventDefault();
                event.stopImmediatePropagation();
            };

            switch (event.code) {
                case "Space": {
                    if (props.playing) {
                        props.onPause();
                        stopEvent();
                    } else {
                        props.onPlay();
                        stopEvent();
                    }

                    break;
                }
                case "ArrowDown": {
                    props.onMinimize();
                    stopEvent();
                    break;
                }
                case "ArrowLeft": {
                    if (event.ctrlKey || event.metaKey) {
                        props.onSkipBack.action();
                    } else {
                        props.onJumpBack();
                    }

                    stopEvent();
                    break;
                }
                case "ArrowRight": {
                    if (event.ctrlKey || event.metaKey) {
                        props.onSkipForward.action();
                    } else {
                        props.onJumpForward();
                    }

                    stopEvent();
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
            <ControlGroup>
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
            <PlayrateControl
                playrate={props.playrate}
                onChange={props.onPlayrateChange}
            />
        </ControlPaneBox>
    );
};

export default ControlPane;
