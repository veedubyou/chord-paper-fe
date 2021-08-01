import TextField from "@material-ui/core/TextField";
import Autocomplete, {
    AutocompleteRenderInputParams,
    createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import React from "react";
import { AllNotes, Note } from "../../common/music/foundation/Note";
import { ScaleName, ScaleTypes } from "../../common/music/scale/Scale";
import lodash from "lodash";

export type SelectableScale = {
    note: Note;
    scaleName: ScaleName;
    label: string;
};

const AllScaleValues: SelectableScale[] = (() => {
    const allOptions: SelectableScale[] = [];
    let note: Note;
    let scaleName: ScaleName;

    for (note in AllNotes) {
        for (scaleName in ScaleTypes) {
            allOptions.push({
                note: note,
                scaleName: scaleName,
                label: `${note} ${scaleName}`,
            });
        }
    }

    return allOptions;
})();

interface ScaleSelectionProps {
    scales: SelectableScale[];
    onSelection: (selection: SelectableScale[]) => void;
}

const ScaleSelection: React.FC<ScaleSelectionProps> = (
    props: ScaleSelectionProps
): JSX.Element => {
    const filterOptions = createFilterOptions<SelectableScale>({
        matchFrom: "start",
    });

    const changeHandler = (
        _event: React.ChangeEvent<{}>,
        newValue: SelectableScale[]
    ) => {
        props.onSelection(newValue);
    };

    // another workaround
    // the selection box needs to be able to provide duplicate options
    // e.g. C ionian, D dorian, C ionian
    // it can't do that right now, but this mechanism can emulate it
    // by making the options a difference reference every time
    // https://github.com/mui-org/material-ui/issues/18755#issuecomment-864118839
    const copiedScaleOptions = lodash.cloneDeep(AllScaleValues);

    return (
        <Autocomplete
            multiple
            options={copiedScaleOptions}
            filterOptions={filterOptions}
            getOptionLabel={(scaleValue) => scaleValue.label}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} variant="outlined" label="Scales" />
            )}
            value={props.scales}
            onChange={changeHandler}
        />
    );
};

export default ScaleSelection;
