import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { PlainFn } from "../../../common/PlainFn";
import { controlPaneStyle } from "../common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import { ButtonActionAndState } from "./useTimeControls";
import PlayrateControl from "./PlayrateControl";
import SectionLabel from "./SectionLabel";

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
    const playPauseButton = props.playing ? (
        <ControlButton.Pause onClick={props.onPause} />
    ) : (
        <ControlButton.Play
            onClick={props.onPlay.action}
            disabled={!props.onPlay.enabled}
        />
    );

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
