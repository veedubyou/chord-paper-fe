import { Box, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { useRegisterTopKeyListener } from "../../GlobalKeyListener";
import { controlPaneStyle } from "../common";
import { ControlButton } from "./ControlButton";
import ControlGroup from "./ControlGroup";
import PlayrateControl from "./PlayrateControl";
import SectionLabel from "./SectionLabel";
import TransposeControl from "./TransposeControl";
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
    playrate: {
        percentage: number;
        onChange: (newPercentage: number) => void;
    };
    transpose?: {
        level: number;
        onChange: (newLevel: number) => void;
    };
    sectionLabel: string;
}

const ControlPaneBox = withStyles((theme: Theme) => {
    const buttonHeight = theme.spacing(5);
    return {
        root: {
            ...controlPaneStyle,
            justifyContent: "space-between",
            // these series of CSS allows flex items
            // to be "pushed off" when they run out of space
            flexWrap: "wrap",
            overflow: "hidden",
            maxHeight: buttonHeight,
        },
    };
})(Box);

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

    const transposeControl: JSX.Element | null = (() => {
        if (props.transpose === undefined) {
            return null;
        }

        return (
            <ControlGroup dividers="left">
                {[
                    <TransposeControl
                        transposeLevel={props.transpose.level}
                        onChange={props.transpose.onChange}
                    />,
                ]}
            </ControlGroup>
        );
    })();

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
            <ControlGroup dividers="left">
                {[
                    <PlayrateControl
                        playratePercentage={props.playrate.percentage}
                        onChange={props.playrate.onChange}
                    />,
                ]}
            </ControlGroup>
            {transposeControl}
        </ControlPaneBox>
    );
};

export default ControlPane;
