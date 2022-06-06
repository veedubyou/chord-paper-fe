import { TextField } from "@mui/material";
import { textFieldValidation } from "components/track_player/dialog/error";
import React from "react";

interface LabelFieldProps {
    value: string;
    onChange: (newValue: string) => void;
}

const LabelField: React.FC<LabelFieldProps> = (
    props: LabelFieldProps
): JSX.Element => {
    const labelChangeHandler = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        props.onChange(event.target.value);
    };

    return (
        <TextField
            label="Track Label"
            variant="outlined"
            value={props.value}
            onChange={labelChangeHandler}
            {...textFieldValidation(props.value)}
        />
    );
};

export default LabelField;
