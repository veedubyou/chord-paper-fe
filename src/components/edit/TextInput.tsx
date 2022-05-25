import { TextFieldProps, TypographyVariant } from "@mui/material";
import React, { useState } from "react";
import { MUIStyledProps } from "../../common/styledProps";
import ControlledTextInput from "./ControlledTextInput";

interface TextInputProps extends MUIStyledProps {
    value: string;
    onFinish?: (newValue: string) => void;
    width?: string;
    typographyVariant?: TypographyVariant;
    variant: TextFieldProps["variant"];
}

const TextInput: React.FC<TextInputProps> = (
    props: TextInputProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.value);

    return (
        <ControlledTextInput
            className={props.className}
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
