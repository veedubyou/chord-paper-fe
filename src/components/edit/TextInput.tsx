import {
    InputBaseComponentProps,
    TextField as UnstyledTextField,
    Theme,
    TypographyVariant,
    useTheme,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { CSSProperties, withStyles } from "@material-ui/styles";
import React from "react";

const TextField = withStyles({
    root: {
        pointerEvents: "auto",
    },
})(UnstyledTextField);

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
    const inputRef: React.RefObject<HTMLInputElement> = React.createRef();
    const theme: Theme = useTheme();

    const value = (): string => {
        if (inputRef.current === null || inputRef.current.value === null) {
            return "";
        }

        return inputRef.current.value;
    };

    const setValue = (newValue: string) => {
        if (inputRef.current === null) {
            return;
        }

        inputRef.current.value = newValue;
    };

    const enterHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (event.key !== "Enter") {
            return false;
        }

        finish(value());
        return true;
    };

    const specialBackspaceHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (!props.onSpecialBackspace) {
            return false;
        }

        const specialBackspace: boolean =
            event.key === "Backspace" && (event.metaKey || event.ctrlKey);
        if (!specialBackspace) {
            return false;
        }

        const selectionAtBeginning: boolean =
            inputRef.current?.selectionStart === 0 &&
            inputRef.current?.selectionEnd === 0;
        if (!selectionAtBeginning) {
            return false;
        }

        props.onSpecialBackspace();
        return true;
    };

    const splitStringBySelection = (): [string, string] => {
        const currValue = value();

        if (
            inputRef.current === null ||
            inputRef.current.selectionStart === null ||
            inputRef.current.selectionEnd === null
        ) {
            return [currValue, ""];
        }

        const beforeSelection = currValue.slice(
            0,
            inputRef.current.selectionStart
        );
        const afterSelection = currValue.slice(inputRef.current.selectionEnd);
        return [beforeSelection, afterSelection];
    };

    const currentSelectionEnd = (): number | null => {
        if (inputRef.current === null) {
            return null;
        }

        return inputRef.current.selectionEnd;
    };

    const tabHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (event.key !== "Tab") {
            return false;
        }

        debugger;

        if (inputRef.current === null) {
            return false;
        }

        const [beforeSelection, afterSelection] = splitStringBySelection();
        const newValue = beforeSelection + "\t" + afterSelection;

        const currentSelection = currentSelectionEnd();
        const nextSelection: number | null =
            currentSelection !== null ? currentSelection + 1 : null;

        setValue(newValue);

        if (nextSelection !== null) {
            inputRef.current.setSelectionRange(nextSelection, nextSelection);
        }

        return true;
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const handlers: ((
            event: React.KeyboardEvent<HTMLDivElement>
        ) => boolean)[] = [enterHandler, specialBackspaceHandler, tabHandler];

        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };

    const finish = (newValue: string) => {
        if (props.onFinish) {
            props.onFinish(newValue);
        }
    };

    const blurHandler = () => {
        finish(value());
    };

    const composeMultilinePaste = (
        pasteContent: string[]
    ): [string, string[]] => {
        const [beforeSelection, afterSelection] = splitStringBySelection();
        const newValue = beforeSelection + pasteContent[0];

        const newPasteLines = pasteContent.slice(1);
        const lastIndex = newPasteLines.length - 1;
        newPasteLines[lastIndex] += afterSelection;

        return [newValue, newPasteLines];
    };

    const pasteHandler = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const payload = event.clipboardData.getData("text/plain");

        if (payload === "") {
            return;
        }

        // handling both Windows + Mac
        let linesOfText: string[] = payload.split("\r\n");
        linesOfText = linesOfText.flatMap((line: string) => line.split("\n"));

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
            defaultValue={props.children}
            onBlur={blurHandler}
            onKeyDown={keyDownHandler}
            onPaste={pasteHandler}
            fullWidth
            data-testid="EditableLine"
        />
    );
};

export default TextInput;
