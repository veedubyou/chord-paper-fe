import { Box, Theme, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { greyTextColour, widthOfString } from "../common";
import { ControlButton } from "./ControlButton";
import { ControlGroupBox } from "./ControlGroup";

const PlayrateBox = withStyles({
    root: {
        justifyContent: "space-between",
    },
})(ControlGroupBox);

const PercentageDisplay = withStyles((theme: Theme) => {
    return {
        root: {
            color: greyTextColour,
            minWidth: widthOfString(theme, "h6", "200%"),
            display: "flex",
            justifyContent: "center",
        },
    };
})(Typography);

interface PlayrateControlProps {
    playratePercentage: number;
    onChange: (newPlayratePercentage: number) => void;
}

const PlayrateControl: React.FC<PlayrateControlProps> = (
    props: PlayrateControlProps
): JSX.Element => {
    const playrate = Math.round(props.playratePercentage);
    const interval = 5;
    const percentage: string = `${playrate}%`;

    const onDecrease = () => props.onChange(playrate - interval);
    const onIncrease = () => props.onChange(playrate + interval);

    const decreaseDisabled = playrate - interval < 50;
    const increaseDisabled = playrate + interval > 100;

    return (
        <PlayrateBox>
            <ControlButton.DecreasePlayrate
                onClick={onDecrease}
                disabled={decreaseDisabled}
            />
            <Tooltip title="Playback speed">
                <PercentageDisplay variant="h6">
                    <Box>{percentage}</Box>
                </PercentageDisplay>
            </Tooltip>

            <ControlButton.IncreasePlayrate
                onClick={onIncrease}
                disabled={increaseDisabled}
            />
        </PlayrateBox>
    );
};

export default PlayrateControl;
