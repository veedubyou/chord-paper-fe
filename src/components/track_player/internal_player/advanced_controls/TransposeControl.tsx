import { Box, styled, Tooltip, Typography } from "@mui/material";
import { greyTextColour, widthOfString } from "components/track_player/common";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import { ControlGroupBox } from "components/track_player/internal_player/ControlGroup";
import React from "react";

const TransposeBox = styled(ControlGroupBox)({
    justifyContent: "space-between",
});

const TransposeDisplay = styled(Typography)(({ theme }) => ({
    color: greyTextColour,
    minWidth: widthOfString(theme, "h6", "♯12"),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

interface TransposeControlProps {
    transposeLevel: number;
    onTransposeChange: (newTransposeLevel: number) => void;
}

const TransposeControl: React.FC<TransposeControlProps> = (
    props: TransposeControlProps
): JSX.Element => {
    const tempo = Math.round(props.transposeLevel);
    const interval = 1;

    const onDecrease = () => props.onTransposeChange(tempo - interval);
    const onIncrease = () => props.onTransposeChange(tempo + interval);

    const decreaseDisabled = tempo - interval < -12;
    const increaseDisabled = tempo + interval > 12;

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

export default React.memo(TransposeControl);
