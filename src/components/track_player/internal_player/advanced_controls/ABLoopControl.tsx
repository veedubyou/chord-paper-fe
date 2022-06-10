import { FirstPage, Repeat } from "@mui/icons-material";
import {
    Box,
    styled,
    ToggleButton as UnstyledToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import {
    ABLoop,
    ABLoopMode,
    isABLoopSet,
    isPlayableABLoop,
} from "components/track_player/internal_player/ABLoop";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import ControlGroup from "components/track_player/internal_player/ControlGroup";
import { useSnackbar } from "notistack";
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
    const { enqueueSnackbar } = useSnackbar();

    const isPointASet = props.abLoop.timeA !== null;
    const isPointBSet = props.abLoop.timeB !== null;

    const getTime = (): number | null => {
        const playerTimeFn = getPlayerTimeRef.current;

        if (playerTimeFn === null) {
            return null;
        }

        return playerTimeFn();
    };

    const ensureMode = (abLoop: ABLoop): ABLoopMode => {
        if (!isABLoopSet(abLoop)) {
            return abLoop.mode;
        }

        const abLoopDisabled = abLoop.mode === "disabled";

        if (abLoopDisabled) {
            const defaultABLoopMode = "rewind";
            return defaultABLoopMode;
        }

        return abLoop.mode;
    };

    const setNewLoop = (newABLoop: ABLoop) => {
        if (isABLoopSet(newABLoop)) {
            if (!isPlayableABLoop(newABLoop)) {
                enqueueSnackbar("Point A must be before Point B", {
                    variant: "warning",
                });

                return;
            }
        }

        const newMode = ensureMode(newABLoop);
        props.onABLoopChange({ ...newABLoop, mode: newMode });
    };

    const setPointA = () => {
        setNewLoop({
            ...props.abLoop,
            timeA: getTime(),
        });
    };

    const setPointB = () => {
        setNewLoop({
            ...props.abLoop,
            timeB: getTime(),
        });
    };

    const clearPointA = () => {
        props.onABLoopChange({
            ...props.abLoop,
            timeA: null,
        });
    };

    const clearPointB = () => {
        props.onABLoopChange({
            ...props.abLoop,
            timeB: null,
        });
    };

    const setAButton = <ControlButton.SetPointA onClick={setPointA} />;
    const clearAButton = <ControlButton.ClearPointA onClick={clearPointA} />;
    const aButton = isPointASet ? clearAButton : setAButton;

    const setBButton = <ControlButton.SetPointB onClick={setPointB} />;
    const clearBButton = <ControlButton.ClearPointB onClick={clearPointB} />;
    const bButton = isPointBSet ? clearBButton : setBButton;

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
            {bButton}
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
