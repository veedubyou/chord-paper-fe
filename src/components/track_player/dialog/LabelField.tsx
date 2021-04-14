import { TextField } from "@material-ui/core";
import React from "react";
import { textFieldValidation } from "./error";

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
