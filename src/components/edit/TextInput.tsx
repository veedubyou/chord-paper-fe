import { makeStyles, Typography, TypographyVariant } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { StyledComponentProps, withStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { PlainFn } from "../../common/PlainFn";

const InputTypography = withStyles({
    root: {
        width: "100%",
        backgroundColor: grey[200],
        whiteSpace: "pre",
        display: "inline-block",
    },
})(Typography);

const useContentEditableStyle = makeStyles({
    root: {
        display: "inline-block",
        width: "100%",
        pointerEvents: "auto",
        userSelect: "text",
        outline: "none",
        // this prevent the span height from collapsing if there's no content
        "&:empty:before": {
            content: '"\\a0"',
        },
    },
});

interface TextInputProps extends StyledComponentProps {
    children: string;
    onFinish?: (newValue: string) => void;
    onSpecialBackspace?: PlainFn;
    onPasteOverflow?: (overflowContent: string[]) => void;
    onJSONPaste?: (jsonStr: string) => boolean;
    variant?: TypographyVariant;
}

const TextInput: React.FC<TextInputProps> = (
    props: TextInputProps
): JSX.Element => {
    const contentEditableRef: React.RefObject<HTMLSpanElement> = React.createRef();

    const value = (): string => {
        if (
            contentEditableRef.current === null ||
            contentEditableRef.current.textContent === null
        ) {
            return "";
        }

        return contentEditableRef.current.textContent;
    };

    const setValue = (newValue: string) => {
        if (contentEditableRef.current === null) {
            return;
        }

        contentEditableRef.current.textContent = newValue;
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

    const selectionRange = (): Range | null => {
        const selection = window.getSelection();
        if (selection === null || selection.rangeCount === 0) {
            return null;
        }

        return selection.getRangeAt(0);
    };

    const selectionOffsets = (): [number, number] | null => {
        if (contentEditableRef.current === null) {
            return null;
        }

        const node = contentEditableRef.current;

        const range = selectionRange();
        if (
            range === null ||
            !node.contains(range.startContainer) ||
            !node.contains(range.endContainer)
        ) {
            return null;
        }

        return [range.startOffset, range.endOffset];
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

        const offsets = selectionOffsets();
        if (offsets === null) {
            return false;
        }

        if (offsets[0] !== 0 || offsets[1] !== 0) {
            return false;
        }

        props.onSpecialBackspace();
        return true;
    };

    const splitStringBySelection = (): [string, string] => {
        const currValue = value();

        const offsets = selectionOffsets();
        if (offsets === null) {
            return [value(), ""];
        }

        const beforeSelection = currValue.slice(0, offsets[0]);
        const afterSelection = currValue.slice(offsets[1]);
        return [beforeSelection, afterSelection];
    };

    const insertTextAtSelection = (newContent: string): boolean => {
        if (contentEditableRef.current === null) {
            return false;
        }

        const range = selectionRange();
        if (range === null) {
            return false;
        }

        range.deleteContents();
        range.insertNode(document.createTextNode(newContent));
        range.collapse(false);
        contentEditableRef.current.normalize();
        return true;
    };

    const tabHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (event.key !== "Tab") {
            return false;
        }

        return insertTextAtSelection("\t");
    };

    const specialStylingKeysHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (!event.metaKey && !event.ctrlKey) {
            return false;
        }

        // prevent bold, underline, or italics commands
        return (
            event.key === "b" ||
            event.key === "B" ||
            event.key === "u" ||
            event.key === "U" ||
            event.key === "i" ||
            event.key === "I"
        );
    };

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const handlers: ((
            event: React.KeyboardEvent<HTMLDivElement>
        ) => boolean)[] = [
            enterHandler,
            specialBackspaceHandler,
            tabHandler,
            specialStylingKeysHandler,
        ];

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

    const handlePlainTextPaste = (
        event: React.ClipboardEvent<HTMLDivElement>
    ): boolean => {
        if (props.onPasteOverflow === undefined) {
            return false;
        }

        const payload = event.clipboardData.getData("text/plain");

        if (payload === "") {
            return false;
        }

        // handling both Windows + Mac
        let linesOfText: string[] = payload.split("\r\n");
        linesOfText = linesOfText.flatMap((line: string) => line.split("\n"));

        if (linesOfText.length === 0) {
            return false;
        }

        if (linesOfText.length === 1) {
            return insertTextAtSelection(linesOfText[0]);
        }

        const [newValue, newPasteLines] = composeMultilinePaste(linesOfText);

        setValue(newValue);
        finish(newValue);
        props.onPasteOverflow(newPasteLines);
        return true;
    };

    const handleJSONPaste = (
        event: React.ClipboardEvent<HTMLDivElement>
    ): boolean => {
        if (props.onJSONPaste === undefined) {
            return false;
        }

        const payload = event.clipboardData.getData("application/json");

        if (payload === "") {
            return false;
        }

        const handled = props.onJSONPaste(payload);
        if (handled) {
            finish(value());
        }

        return handled;
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const handlers: ((
            event: React.ClipboardEvent<HTMLDivElement>
        ) => boolean)[] = [handleJSONPaste, handlePlainTextPaste];

        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };

    const focusAndPlaceCaret = () => {
        if (contentEditableRef.current === null) {
            return;
        }

        contentEditableRef.current.focus();

        const selection = window.getSelection();
        if (selection === null) {
            return;
        }

        const newRange = document.createRange();
        newRange.selectNodeContents(contentEditableRef.current);
        newRange.collapse(false);

        selection.removeAllRanges();
        selection.addRange(newRange);
    };

    useEffect(focusAndPlaceCaret);

    const contentEditableStyle = useContentEditableStyle();

    return (
        <InputTypography
            classes={props.classes}
            variant={props.variant}
            display="inline"
            data-testid="EditableLine"
        >
            <span
                contentEditable
                className={contentEditableStyle.root}
                ref={contentEditableRef}
                data-testid="InnerInput"
                onBlur={blurHandler}
                onKeyDown={keyDownHandler}
                onPaste={handlePaste}
                suppressContentEditableWarning
            >
                {props.children}
            </span>
        </InputTypography>
    );
};

export default TextInput;
