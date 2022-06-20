import { Box, styled, Tooltip, Typography } from "@mui/material";
import { greyTextColour, widthOfString } from "components/track_player/common";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import { ControlGroupBox } from "components/track_player/internal_player/ControlGroup";
import React from "react";

const TempoBox = styled(ControlGroupBox)({
    justifyContent: "space-between",
});

const PercentageDisplay = styled(Typography)(({ theme }) => ({
    color: greyTextColour,
    minWidth: widthOfString(theme, "h6", "200%"),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

interface TempoControlProps {
    tempoPercentage: number;
    onTempoChange: (newTempoPercentage: number) => void;
}

const TempoControl: React.FC<TempoControlProps> = (
    props: TempoControlProps
): JSX.Element => {
    const tempoPercentage = Math.round(props.tempoPercentage);
    const interval = 5;
    const percentageDisplay: string = `${tempoPercentage}%`;

    const onDecrease = () => props.onTempoChange(tempoPercentage - interval);
    const onIncrease = () => props.onTempoChange(tempoPercentage + interval);

    const decreaseDisabled = tempoPercentage - interval < 50;
    const increaseDisabled = tempoPercentage + interval > 100;

    return (
        <TempoBox>
            <ControlButton.DecreaseTempo
                onClick={onDecrease}
                disabled={decreaseDisabled}
            />
            <Tooltip title="Playback speed">
                <PercentageDisplay variant="h6">
                    <Box>{percentageDisplay}</Box>
                </PercentageDisplay>
            </Tooltip>

            <ControlButton.IncreaseTempo
                onClick={onIncrease}
                disabled={increaseDisabled}
            />
        </TempoBox>
    );
};

export default React.memo(TempoControl);
