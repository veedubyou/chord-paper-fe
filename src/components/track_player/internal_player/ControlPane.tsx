import { Box, styled } from "@mui/material";
import { controlPaneStyle } from "components/track_player/common";
import AdvancedControls from "components/track_player/internal_player/advanced_controls/AdvancedControls";
import { ControlGroupBox } from "components/track_player/internal_player/ControlGroup";
import TransportControl from "components/track_player/internal_player/TransportControl";
import {
    ABLoopControl,
    TempoControl,
    TransportActions,
} from "components/track_player/internal_player/usePlayerControls";
import React from "react";

interface ControlPaneProps {
    playing: boolean;
    transport: TransportActions;
    tempo: TempoControl;
    abLoop: ABLoopControl;
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
    return (
        <ControlPaneBox>
            <TransportControl
                playing={props.playing}
                transport={props.transport}
            />
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
