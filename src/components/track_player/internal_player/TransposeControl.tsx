import { Box, styled, Tooltip, Typography } from "@mui/material";
import React from "react";
import { greyTextColour } from "../common";
import { ControlButton } from "./ControlButton";
import { ControlGroupBox } from "./ControlGroup";

const TransposeBox = styled(ControlGroupBox)({
    justifyContent: "space-between",
});

const TransposeDisplay = styled(Typography)(({ theme }) => ({
    color: greyTextColour,
    display: "flex",
    justifyContent: "center",
}));

interface TransposeControlProps {
    transposeLevel: number;
    onChange: (newTransposeLevel: number) => void;
}

const TransposeControl: React.FC<TransposeControlProps> = (
    props: TransposeControlProps
): JSX.Element => {
    const playrate = Math.round(props.transposeLevel);
    const interval = 1;

    const onDecrease = () => props.onChange(playrate - interval);
    const onIncrease = () => props.onChange(playrate + interval);

    const decreaseDisabled = playrate - interval < -12;
    const increaseDisabled = playrate + interval > 12;

    const transposeText: string = (() => {
        if (props.transposeLevel > 0) {
            return `♯${props.transposeLevel}`;
        }

        if (props.transposeLevel < 0) {
            return `♭${-props.transposeLevel}`;
        }

        return "♮0";
    })();

    return (
        <TransposeBox>
            <ControlButton.TransposeDown
                onClick={onDecrease}
                disabled={decreaseDisabled}
            />
            <Tooltip title="Transposition">
                <TransposeDisplay variant="h6">
                    <Box>{transposeText}</Box>
                </TransposeDisplay>
            </Tooltip>
            <ControlButton.TransposeUp
                onClick={onIncrease}
                disabled={increaseDisabled}
            />
        </TransposeBox>
    );
};

export default TransposeControl;
