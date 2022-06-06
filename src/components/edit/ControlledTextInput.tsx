import {
    InputBaseComponentProps,
    TextField,
    TextFieldProps,
    Theme,
    TypographyStyle,
    TypographyVariant,
    useTheme
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { MUIStyledProps } from "common/styledProps";
import React from "react";

interface ControlledTextInputProps extends MUIStyledProps {
    value: string;
    onValueChange: (newValue: string) => void;
    onFinish?: (newValue: string) => void;
    width?: string;
    variant: TextFieldProps["variant"];
    InputProps?: TextFieldProps["InputProps"];
    inputRef?: TextFieldProps["inputRef"];
    error?: TextFieldProps["error"];
    typographyVariant?: TypographyVariant;
    placeholder?: string;
    paddingSpacing?: number;
}

const ControlledTextInput: React.FC<ControlledTextInputProps> = (
    props: ControlledTextInputProps
): JSX.Element => {
    const theme: Theme = useTheme();

    const updateValue = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        props.onValueChange(event.target.value);
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            finish(props.value);
        }
    };

    const finish = (newValue: string) => {
        props.onFinish?.(newValue);
    };

    const blurHandler = () => {
        finish(props.value);
    };

    const browserInputProps = (() => {
        let variant: TypographyStyle | undefined = undefined;
        if (props.typographyVariant !== undefined) {
            variant = theme?.typography?.[props.typographyVariant];
        }

        const padding: string = (() => {
            if (props.paddingSpacing === undefined) {
                return "0px";
            }

            return theme.spacing(props.paddingSpacing);
        })();

        const fontSize: string | number | undefined = variant?.fontSize;

        const inputProps: InputBaseComponentProps = {
            style: {
                padding: padding,
                fontSize: fontSize,
                opacity: 1,
                background: grey[100],
            },
        };

        if (props.width !== undefined && inputProps.style) {
            inputProps.style.width = props.width;
        }

        return inputProps;
    })();

    return (
        <TextField
            autoFocus
            className={props.className}
            variant={props.variant}
            inputProps={{
                "data-testid": "InnerInput",
                spellCheck: false,
                ...browserInputProps,
            }}
            InputProps={props.InputProps}
            inputRef={props.inputRef}
            value={props.value}
            onBlur={blurHandler}
            onChange={updateValue}
            onKeyDown={keyDownHandler}
            placeholder={props.placeholder}
            error={props.error}
            fullWidth
            data-testid="TextInput"
        />
    );
};

export default ControlledTextInput;
