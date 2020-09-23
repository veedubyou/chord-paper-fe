import {
    InputBaseComponentProps,
    TextField,
    Theme,
    TypographyVariant,
    useTheme,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { CSSProperties, StyledComponentProps } from "@material-ui/styles";
import React, { useState } from "react";

interface TextInputProps extends StyledComponentProps {
    children: string;
    onFinish?: (newValue: string) => void;
    width?: string;
    variant?: TypographyVariant;
}

const TextInput: React.FC<TextInputProps> = (
    props: TextInputProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.children);
    const inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    const theme: Theme = useTheme();

    const updateValue = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setValue(event.target.value);
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            finish(value);
        }
    };

    const finish = (newValue: string) => {
        if (props.onFinish) {
            props.onFinish(newValue);
        }
    };

    const blurHandler = () => {
        finish(value);
    };

    const browserInputProps = () => {
        let variant: CSSProperties | undefined = undefined;
        if (props.variant !== undefined) {
            variant = theme?.typography?.[props.variant];
        }

        const padding: string | number | undefined =
            variant?.padding !== undefined ? variant.padding : 0;
        const fontSize: string | number | undefined = variant?.fontSize;

        const inputProps: InputBaseComponentProps = {
            style: {
                padding: padding,
                fontSize: fontSize,
                opacity: 1,
                background: grey[100],
            },
            className: props.classes?.root,
        };

        if (props.width !== undefined && inputProps.style) {
            inputProps.style.width = props.width;
        }

        return inputProps;
    };

    return (
        <TextField
            autoFocus
            variant="filled"
            inputProps={{
                "data-testid": "InnerInput",
                ...browserInputProps(),
            }}
            inputRef={inputRef}
            value={value}
            onBlur={blurHandler}
            onChange={updateValue}
            onKeyDown={keyDownHandler}
            fullWidth
            data-testid="TextInput"
        />
    );
};

export default TextInput;
