import { TextFieldProps, TypographyVariant } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/styles";
import React, { useState } from "react";
import ControlledTextInput from "./ControlledTextInput";

interface TextInputProps extends StyledComponentProps {
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
