import { FirstPage, Repeat } from "@mui/icons-material";
import {
    styled,
    ToggleButton as UnstyledToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import {
    ABLoop,
    ABLoopMode,
} from "components/track_player/internal_player/ABLoop";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import ControlGroup from "components/track_player/internal_player/ControlGroup";
import { useContext } from "react";

const ToggleButton = styled(UnstyledToggleButton)(({ theme }) => ({
    border: "none",
    borderRadius: theme.spacing(1),
}));

interface ABLoopControlProps {
    abLoop: ABLoop;
    onABLoopChange: (newABLoop: ABLoop) => void;
}

const ABLoopControl: React.FC<ABLoopControlProps> = (
    props: ABLoopControlProps
): JSX.Element => {
    const getPlayerTimeRef = useContext(PlayerTimeContext);

    const isPointASet = props.abLoop.timeA !== null;

    const setPointA = () => {
        const newTime = (function () {
            const playerTimeFn = getPlayerTimeRef.current;

            if (playerTimeFn === null) {
                return null;
            }

            return playerTimeFn();
        })();

        const newMode: ABLoopMode = (function () {
            const abLoopTurnedOff = props.abLoop.mode === "disabled";

            if (abLoopTurnedOff) {
                const defaultABLoopMode = "rewind";
                return defaultABLoopMode;
            }

            return props.abLoop.mode;
        })();

        props.onABLoopChange({
            timeA: newTime,
            mode: newMode,
        });
    };

    const clearPointA = () => {
        props.onABLoopChange({
            ...props.abLoop,
            timeA: null,
        });
    };

    const setAButton = <ControlButton.SetPointA onClick={setPointA} />;
    const clearAButton = <ControlButton.ClearPointA onClick={clearPointA} />;
    const aButton = isPointASet ? clearAButton : setAButton;

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        changedMode: "loop" | "rewind" | null
    ) => {
        const newMode: "loop" | "rewind" | "disabled" =
            changedMode ?? "disabled";

        props.onABLoopChange({
            ...props.abLoop,
            mode: newMode,
        });
    };

    return (
        <ControlGroup dividers="left">
            {aButton}
            <ToggleButtonGroup
                size="small"
                color="primary"
                value={props.abLoop.mode}
                onChange={handleModeChange}
                exclusive
            >
                <ToggleButton value="rewind">
                    <FirstPage />
                </ToggleButton>
                <ToggleButton value="loop">
                    <Repeat />
                </ToggleButton>
            </ToggleButtonGroup>
        </ControlGroup>
    );
};

export default ABLoopControl;

