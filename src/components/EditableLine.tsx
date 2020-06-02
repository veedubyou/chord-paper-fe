import {
    Theme,
    useTheme,
    FilledInput as UnstyledFilledInput,
    InputBaseComponentProps,
} from "@material-ui/core";
import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import { DataTestID } from "../common/DataTestID";

const FilledInput = withStyles((theme: Theme) => ({
    root: {
        fontSize: theme.typography.h5.fontSize,
    },
}))(UnstyledFilledInput);

const browserInputProps = (theme: Theme, width?: string) => {
    let padding: string | number = 0;
    if (theme?.typography?.h5?.padding) {
        padding = theme.typography.h5.padding;
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

interface EditableLineProps extends DataTestID {
    children: string;
    onFinish?: (newValue: string) => void;
    onPasteOverflow?: (overflowContent: string[]) => void;
    width?: string;
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

    const forwardEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
            onKeyPress={forwardEnter}
            onPaste={pasteHandler}
            fullWidth
            data-testid={props["data-testid"]}
        />
    );
};

export default EditableLine;
