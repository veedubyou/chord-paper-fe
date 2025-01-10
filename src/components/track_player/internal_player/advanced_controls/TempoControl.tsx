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

    const smallInterval = 1;
    const mediumInterval = 5;
    const percentageDisplay: string = `${tempoPercentage}%`;

    const onSmallDecrease = (event: React.MouseEvent) => {
        props.onTempoChange(tempoPercentage - smallInterval);
        event.preventDefault();
    }
    const onSmallIncrease = (event: React.MouseEvent) => {
        props.onTempoChange(tempoPercentage + smallInterval);
        event.preventDefault();
    }

    const onMediumDecrease = () => props.onTempoChange(tempoPercentage - mediumInterval);
    const onMediumIncrease = () => props.onTempoChange(tempoPercentage + mediumInterval);

    const decreaseDisabled = tempoPercentage - mediumInterval < 50;
    const increaseDisabled = tempoPercentage + mediumInterval > 150;

    return (
        <TempoBox>
            <ControlButton.DecreaseTempo
                onClick={onMediumDecrease}
                onContextMenu={onSmallDecrease}
                disabled={decreaseDisabled}
            />
            <Tooltip title="Playback speed">
                <PercentageDisplay variant="h6">
                    <Box>{percentageDisplay}</Box>
                </PercentageDisplay>
            </Tooltip>

            <ControlButton.IncreaseTempo
                onClick={onMediumIncrease}
                onContextMenu={onSmallIncrease}
                disabled={increaseDisabled}
            />
        </TempoBox>
    );
};

export default React.memo(TempoControl);
