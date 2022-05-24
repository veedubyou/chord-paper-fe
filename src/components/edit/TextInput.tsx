import { TextFieldProps, Theme, TypographyVariant } from "@mui/material";
import { StyledComponentProps } from "@mui/styles";
import { MUIStyledCommonProps } from "@mui/system";
import React, { useState } from "react";
import ControlledTextInput from "./ControlledTextInput";

interface TextInputProps extends MUIStyledCommonProps<Theme> {
    value: string;
    onFinish?: (newValue: string) => void;
    width?: string;
    typographyVariant?: TypographyVariant;
    variant: TextFieldProps["variant"];
    className?: string;
}

const TextInput: React.FC<TextInputProps> = (
    props: TextInputProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.value);

    return (
        <ControlledTextInput
            className={props.className}
            sx={props.sx}
            value={value}
            onValueChange={setValue}
            variant={props.variant}
            typographyVariant={props.typographyVariant}
            width={props.width}
            onFinish={props.onFinish}
        />
    );
};

export default TextInput;
