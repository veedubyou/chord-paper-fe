import { FirstPage, Repeat } from "@mui/icons-material";
import {
    Collapse,
    styled,
    ToggleButton as UnstyledToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import {
    ABLoop,
    ABLoopMode
} from "components/track_player/internal_player/ABLoop";
import { ControlButton } from "components/track_player/internal_player/ControlButton";
import ControlGroup, {
    ControlGroupBox
} from "components/track_player/internal_player/ControlGroup";
import { Either, isLeft } from "fp-ts/lib/Either";
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

    const abLoop = props.abLoop;

    const isPointASet = abLoop.timeA !== null;
    const isPointBSet = !abLoop.isDefaultLoop() && abLoop.timeB !== null;
    const isDefaultLoopSet = abLoop.isDefaultLoop();
    const showBButton = !isDefaultLoopSet;

    const getTime = (): number | null => {
        return getPlayerTimeRef.current();
    };

    const ensureMode = (abLoop: ABLoop): ABLoopMode => {
        if (!abLoop.isSet()) {
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
        const newMode = ensureMode(newABLoop);
        props.onABLoopChange(newABLoop.setMode(newMode));
    };

    const checkErrorAndSetNewLoop = (
        newABLoopResult: Either<Error, ABLoop>
    ) => {
        if (isLeft(newABLoopResult)) {
            enqueueSnackbar(newABLoopResult.left.message, {
                variant: "warning",
            });

            return;
        }

        setNewLoop(newABLoopResult.right);
    };

    const setPointA = () => {
        checkErrorAndSetNewLoop(abLoop.setA(getTime()));
    };

    const setPointB = () => {
        checkErrorAndSetNewLoop(abLoop.setB(getTime()));
    };

    const clearPointA = () => {
        setNewLoop(abLoop.clearA());
    };

    const clearPointB = () => {
        setNewLoop(abLoop.clearB());
    };

    const setDefaultLoop = () => {
        setNewLoop(abLoop.setDefaultLoop());
    };

    const clearDefaultLoop = clearPointB;

    const setAButton = <ControlButton.SetPointA onClick={setPointA} />;
    const clearAButton = <ControlButton.ClearPointA onClick={clearPointA} />;
    const aButton = isPointASet ? clearAButton : setAButton;

    const setBButton = <ControlButton.SetPointB onClick={setPointB} />;
    const clearBButton = <ControlButton.ClearPointB onClick={clearPointB} />;
    const bButton = isPointBSet ? clearBButton : setBButton;

    const enableDefaultLoopButton = (
        <ControlButton.EnableDefaultLoop onClick={setDefaultLoop} />
    );
    const disableDefaultLoopButton = (
        <ControlButton.DisableDefaultLoop onClick={clearDefaultLoop} />
    );
    const defaultLoopButton = isDefaultLoopSet
        ? disableDefaultLoopButton
        : enableDefaultLoopButton;

    const handleModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        changedMode: "loop" | "rewind" | null
    ) => {
        const newMode: "loop" | "rewind" | "disabled" =
            changedMode ?? "disabled";

        props.onABLoopChange(abLoop.setMode(newMode));
    };

    return (
        <ControlGroup dividers="left">
            <ControlGroupBox>
                {aButton}
                <Collapse in={showBButton} orientation="horizontal">
                    {bButton}
                </Collapse>
            </ControlGroupBox>
            {defaultLoopButton}
            <ToggleButtonGroup
                size="small"
                color="primary"
                value={abLoop.mode}
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
