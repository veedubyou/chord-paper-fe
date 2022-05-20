import { Box, Button, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { combine, interpolate, separate } from 'flubber';
import React, { useEffect, useState } from "react";
import { animated, Spring, SpringValues, useSpring } from "react-spring";
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

const RightJustifiedControlGroup = withStyles({
    root: {
        marginLeft: "auto",
    },
})(ControlGroup);

export const ControlPaneBox = withStyles((theme: Theme) => {
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
            <ControlGroup dividers="left" edgeDivider>
                {[
                    <TransposeControl
                        key="transpose-control"
                        transposeLevel={props.transpose.level}
                        onChange={props.transpose.onChange}
                    />,
                ]}
            </ControlGroup>
        );
    })();

    // const heartIcon = "M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z";
    const closeIcon = "M18.3 5.71 a.9959.9959 0 00-1.41 0 L12 10.59 7.11 5.7 a.9959.9959 0 00-1.41 0 c-.39.39-.39 1.02 0 1.41 L10.59 12 5.7 16.89 c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0 L12 13.41 l4.89 4.89 c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41 L13.41 12l4.89-4.89 c.38-.38.38-1.02 0-1.4 z";
    const metronomeIcon = [
        "m 16,21 c 0.3,0 0.6,-0.1 0.8,-0.4 l 13,-17 C 30.1,3.2 30.1,2.5 29.6,2.2 29.2,1.9 28.5,1.9 28.2,2.4 l -5.7,7.5 -1,-4.8 C 21.1,3.3 19.5,2 17.7,2 H 14.3 C 12.5,2 10.9,3.2 10.5,5 L 5.8,25.5 c -0.3,1.1 0,2.2 0.7,3.1 0.7,0.9 1.7,1.4 2.8,1.4 h 13.3 c 1.1,0 2.2,-0.5 2.9,-1.4 0.7,-0.9 0.9,-2 0.7,-3.1 L 23.7,15.8 C 23.6,15.3 23,14.9 22.5,15.1 22,15.2 21.6,15.8 21.8,16.3 l 1.5,5.8 H 8.6 L 12.4,5.6 c 0.2,-0.9 1,-1.5 1.8,-1.5 h 3.4 c 0.9,0 1.7,0.6 1.8,1.5 l 1.4,6.5 -5.6,7.4 c -0.3,0.4 -0.3,1.1 0.2,1.4 0.2,0 0.4,0.1 0.6,0.1 z",
        "M 15,8 h 2 C 17.6,8 18,7.6 18,7 18,6.4 17.6,6 17,6 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z",
        "M 15,11 h 2 c 0.6,0 1,-0.4 1,-1 0,-0.6 -0.4,-1 -1,-1 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z",
        "M 15,14 h 2 c 0.6,0 1,-0.4 1,-1 0,-0.6 -0.4,-1 -1,-1 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z"
    ];

    const [isClose, setClose] = useState(false);

    const interpolator = (() => {
        if (isClose) {
            return separate(closeIcon, metronomeIcon, {single: true});
        }

        return combine(metronomeIcon, closeIcon, {single: true});
    })();

    const specialButton = <Button onClick={() => setClose(!isClose)}>
        <svg width="24" height="24" viewBox="0 0 24 24">
            <g>
                <Spring reset from={{ t: 0 }} to={{ t: 1 }} config={{duration: 200}}>
                    {({ t }) => <animated.path d={t.to(interpolator)} />}
                </Spring>
            </g>
        </svg>
    </Button>

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
                {specialButton}
            </ControlGroup>
            <SectionLabel value={props.sectionLabel} />
            <RightJustifiedControlGroup dividers="left">
                {[
                    <PlayrateControl
                        key="playrate-control"
                        playratePercentage={props.playrate.percentage}
                        onChange={props.playrate.onChange}
                    />,
                ]}
            </RightJustifiedControlGroup>
            {transposeControl}
        </ControlPaneBox>
    );
};

export default ControlPane;
