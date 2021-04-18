import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect, useRef } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { controlPaneStyle } from "../common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import { ButtonActionAndState } from "./useTimeControls";
import PlayrateControl from "./PlayrateControl";
import SectionLabel from "./SectionLabel";
import { useRegisterTopKeyListener } from "../../GlobalKeyListener";

interface ControlPaneProps {
    playing: boolean;
    onPlay: ButtonActionAndState;
    onPause: PlainFn;
    onJumpBack: PlainFn;
    onJumpForward: PlainFn;
    onGoToBeginning: PlainFn;
    onSkipBack: ButtonActionAndState;
    onSkipForward: ButtonActionAndState;
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
    const pauseRef = useRef<HTMLButtonElement>(null);
    const playRef = useRef<HTMLButtonElement>(null);
    const jumpBackRef = useRef<HTMLButtonElement>(null);
    const jumpForwardRef = useRef<HTMLButtonElement>(null);
    const skipBackRef = useRef<HTMLButtonElement>(null);
    const skipForwardRef = useRef<HTMLButtonElement>(null);

    const playPauseButton = props.playing ? (
        <ControlButton.Pause ref={pauseRef} onClick={props.onPause} />
    ) : (
        <ControlButton.Play
            ref={playRef}
            onClick={props.onPlay.action}
            disabled={!props.onPlay.enabled}
        />
    );

    console.log("control renrender");

    // useEffect(() => {
    //     const handleKey = (event: KeyboardEvent) => {
    //         console.log("handling key");
    //         event.stopImmediatePropagation();
    //     };

    //     addTopKeyListener(handleKey);

    //     return () => removeKeyListener(handleKey);
    // }, [
    //     addTopKeyListener,
    //     removeKeyListener,
    //     playRef,
    //     pauseRef,
    //     jumpBackRef,
    //     jumpForwardRef,
    //     skipBackRef,
    //     skipForwardRef,
    // ]);

    return (
        <ControlPaneBox>
            <ControlGroup>
                <ControlButton.Beginning onClick={props.onGoToBeginning} />
                <ControlButton.SkipBack
                    ref={skipBackRef}
                    disabled={!props.onSkipBack.enabled}
                    onClick={props.onSkipBack.action}
                />
                <ControlButton.JumpBack
                    ref={jumpBackRef}
                    onClick={props.onJumpBack}
                />
                {playPauseButton}
                <ControlButton.JumpForward
                    ref={jumpForwardRef}
                    onClick={props.onJumpForward}
                />
                <ControlButton.SkipForward
                    ref={skipForwardRef}
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
