import { TextFieldProps } from "@mui/material";

const validateValue = (value: string): boolean => {
    return value.trim() !== "";
};

export const textFieldValidation = (value: string): TextFieldProps => {
    const validValue = validateValue(value);

    return {
        error: validValue ? undefined : true,
        helperText: validValue ? undefined : "Can't be empty",
    };
};
