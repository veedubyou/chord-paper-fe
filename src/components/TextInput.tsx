import {
    Theme,
    useTheme,
    InputBaseComponentProps,
    TypographyVariant,
    TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { CSSProperties } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";

interface TextInputProps {
    children: string;
    onFinish?: (newValue: string) => void;
    onSpecialBackspace?: () => void;
    onPasteOverflow?: (overflowContent: string[]) => void;
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
            return;
        }

        const specialBackspace: boolean =
            event.key === "Backspace" && (event.metaKey || event.ctrlKey);
        const selectionAtBeginning: boolean =
            inputRef.current?.selectionStart === 0 &&
            inputRef.current?.selectionEnd === 0;

        if (
            specialBackspace &&
            selectionAtBeginning &&
            props.onSpecialBackspace
        ) {
            props.onSpecialBackspace();
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

    const composeMultilinePaste = (
        pasteContent: string[]
    ): [string, string[]] => {
        let beforeSelectionStr: string;
        let afterSelectionStr: string;
        if (
            inputRef.current === null ||
            inputRef.current.selectionStart === null ||
            inputRef.current.selectionEnd === null
        ) {
            beforeSelectionStr = value;
            afterSelectionStr = "";
        } else {
            beforeSelectionStr = value.slice(
                0,
                inputRef.current.selectionStart
            );
            afterSelectionStr = value.slice(inputRef.current.selectionEnd);
        }

        const newValue = beforeSelectionStr + pasteContent[0];

        const newPasteLines = pasteContent.slice(1);
        const lastIndex = newPasteLines.length - 1;
        newPasteLines[lastIndex] += afterSelectionStr;

        return [newValue, newPasteLines];
    };

    const pasteHandler = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const payload = event.clipboardData.getData("text/plain");

        if (payload === "") {
            return;
        }

        const linesOfText: string[] = payload.split("\n");

        if (linesOfText.length > 1 && props.onPasteOverflow !== undefined) {
            event.preventDefault();

            const [newValue, newPasteLines] = composeMultilinePaste(
                linesOfText
            );

            setValue(newValue);
            finish(newValue);
            props.onPasteOverflow(newPasteLines);
        }
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
                tabSize: "60px",
            },
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
            onPaste={pasteHandler}
            fullWidth
            data-testid="EditableLine"
        />
    );
};

export default TextInput;
