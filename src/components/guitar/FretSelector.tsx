import { TextField } from "@material-ui/core";
import React from "react";
import { StartingFret } from "./ScaleChart";

interface FretSelectorProps {
    startingFret: StartingFret;
    onStartingFretChanged: (startingFret: StartingFret) => void;
}

const FretSelector: React.FC<FretSelectorProps> = (
    props: FretSelectorProps
): JSX.Element => {
    return (
        <TextField
            label="Starting Fret"
            type="number"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
            value={props.startingFret}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const val = parseInt(event.target.value);
                if (val <= 0 || val > 21) {
                    return;
                }

                if (val % 1 !== 0) {
                    return;
                }

                props.onStartingFretChanged(val as StartingFret);
            }}
        />
    );
};

export default FretSelector;
