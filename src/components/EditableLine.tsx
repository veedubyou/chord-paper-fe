import {
    Theme,
    useTheme,
    FilledInput as UnstyledFilledInput,
    InputBaseComponentProps,
    TypographyVariant,
} from "@material-ui/core";
import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";

interface EditableLineProps {
    children: string;
    onFinish?: (newValue: string) => void;
    onPasteOverflow?: (overflowContent: string[]) => void;
    width?: string;
    variant?: TypographyVariant;
}

const EditableLine: React.FC<EditableLineProps> = (
    props: EditableLineProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.children);
    const inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    const theme = useTheme();

    const updateValue = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setValue(event.target.value);
    };

    const forwardEnter = (
        event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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

    const browserInputProps = (theme: Theme, width?: string) => {
        let padding: string | number | undefined = 0;
        if (
            props.variant !== undefined &&
            theme?.typography?.[props.variant]?.padding
        ) {
            padding = theme.typography[props.variant].padding;
        }

        const inputProps: InputBaseComponentProps = {
            style: {
                padding: padding,
            },
        };

        if (width && inputProps.style) {
            inputProps.style.width = width;
        }

        return inputProps;
    };

    const FilledInput = withStyles((theme: Theme) => {
        if (props.variant === undefined) {
            return { root: {} };
        }

        return {
            root: {
                fontSize: theme.typography[props.variant].fontSize,
            },
        };
    })(UnstyledFilledInput);

    return (
        <FilledInput
            autoFocus
            inputProps={{
                "data-testid": "InnerInput",
                ...browserInputProps(theme, props.width),
            }}
            inputRef={inputRef}
            value={value}
            onBlur={blurHandler}
            onChange={updateValue}
            onKeyDown={forwardEnter}
            onPaste={pasteHandler}
            fullWidth
            data-testid="EditableLine"
        />
    );
};

export default EditableLine;
