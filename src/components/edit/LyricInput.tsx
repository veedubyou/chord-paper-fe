import { makeStyles, Typography, TypographyVariant } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { StyledComponentProps, withStyles } from "@material-ui/styles";
import React, { useEffect } from "react";
import { Lyric } from "../../common/ChordModel/Lyric";
import { PlainFn } from "../../common/PlainFn";
import { deserializeLyrics, serializeLyrics } from "../lyrics/Serialization";
import { SizedTab } from "../lyrics/Tab";
import { useDomLyricTab } from "../lyrics/Tab";

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

interface LyricInputProps extends StyledComponentProps {
    children: Lyric;
    onFinish?: (newValue: Lyric) => void;
    onSpecialBackspace?: PlainFn;
    onLyricOverflow?: (overflowContent: Lyric[]) => void;
    onJSONPaste?: (jsonStr: string) => boolean;
    variant?: TypographyVariant;
}

const LyricInput: React.FC<LyricInputProps> = (
    props: LyricInputProps
): JSX.Element => {
    const contentEditableRef: React.RefObject<HTMLSpanElement> = React.createRef();
    const domLyricTab = useDomLyricTab();

    const contentEditableElement = (): HTMLSpanElement => {
        if (contentEditableRef.current === null) {
            throw new Error("unexpected for ref to be null");
        }

        return contentEditableRef.current;
    };

    const value = (): Lyric => {
        const elem = contentEditableElement();
        if (elem.textContent === null) {
            return new Lyric("");
        }

        return serializeLyrics(elem.childNodes);
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
        if (contentEditableRef.current === null) {
            return null;
        }

        const node = contentEditableRef.current;

        const selection = window.getSelection();
        if (selection === null || selection.rangeCount === 0) {
            return null;
        }

        const range = selection.getRangeAt(0);
        if (
            range === null ||
            !node.contains(range.startContainer) ||
            !node.contains(range.endContainer)
        ) {
            return null;
        }

        return range;
    };

    const serializedLyricsFromRange = (range: Range): Lyric => {
        const documentFragment = range.cloneContents();
        return serializeLyrics(documentFragment.childNodes);
    };

    const isSelectionAtBeginning = (): boolean => {
        const range: Range | null = selectionRange();
        if (range === null) {
            return false;
        }

        if (!range.collapsed) {
            return false;
        }

        const elem = contentEditableElement();
        if (range.startContainer === elem && range.startOffset === 0) {
            return true;
        }

        if (elem.firstChild !== null) {
            if (
                range.startContainer === elem.firstChild &&
                range.startOffset === 0
            ) {
                return true;
            }
        }

        return false;
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

        if (!isSelectionAtBeginning()) {
            return false;
        }

        props.onSpecialBackspace();
        return true;
    };

    const specialEnterHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (!props.onLyricOverflow) {
            return false;
        }

        const specialEnter: boolean =
            event.key === "Enter" && (event.metaKey || event.ctrlKey);
        if (!specialEnter) {
            return false;
        }

        const [beforeSelection, afterSelection] = splitContentBySelection();

        const serializedLyricsBeforeSelection: Lyric = serializeLyrics(
            beforeSelection.cloneContents().childNodes
        );
        finish(serializedLyricsBeforeSelection);

        const serializedLyricsAfterSelection: Lyric = serializeLyrics(
            afterSelection.cloneContents().childNodes
        );

        props.onLyricOverflow([serializedLyricsAfterSelection]);
        return true;
    };

    const splitContentBySelection = (): [Range, Range] => {
        const currentRange: Range | null = selectionRange();
        const elem = contentEditableElement();

        const beforeRange: Range = document.createRange();
        const afterRange: Range = document.createRange();

        if (currentRange !== null) {
            beforeRange.setStart(elem, 0);
            beforeRange.setEnd(
                currentRange.startContainer,
                currentRange.startOffset
            );
            afterRange.setStart(
                currentRange.endContainer,
                currentRange.endOffset
            );
            afterRange.setEnd(elem, elem.childNodes.length);
        } else {
            beforeRange.selectNodeContents(elem);
            afterRange.setStart(
                beforeRange.endContainer,
                beforeRange.endOffset
            );
            afterRange.setEnd(beforeRange.endContainer, beforeRange.endOffset);
        }

        return [beforeRange, afterRange];
    };

    const insertNodeAtSelection = (node: Node): boolean => {
        if (contentEditableRef.current === null) {
            return false;
        }

        const range = selectionRange();
        if (range === null) {
            return false;
        }

        range.deleteContents();
        range.insertNode(node);
        range.collapse(false);
        contentEditableRef.current.normalize();
        return true;
    };

    const insertTextAtSelection = (newContent: string): boolean => {
        return insertNodeAtSelection(document.createTextNode(newContent));
    };

    const insertSizedTabAtSelection = (sizedTab: SizedTab): boolean => {
        const domNode = domLyricTab(sizedTab);
        return insertNodeAtSelection(domNode);
    };

    const tabHandler = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): boolean => {
        if (event.key !== "Tab") {
            return false;
        }

        //TODO: make this depend on stuff
        return insertSizedTabAtSelection(SizedTab.Size2Tab);
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
            specialEnterHandler,
            specialBackspaceHandler,
            tabHandler,
            enterHandler,
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

    const finish = (newValue: Lyric) => {
        if (props.onFinish) {
            props.onFinish(newValue);
        }
    };

    const blurHandler = () => {
        finish(value());
    };

    const composeMultilinePaste = (
        pasteContent: string[]
    ): [Lyric, Lyric[]] => {
        const [beforeSelection, afterSelection] = splitContentBySelection();
        const serializedLyricsForThisLine: Lyric = serializedLyricsFromRange(
            beforeSelection
        );
        serializedLyricsForThisLine.append(pasteContent[0]);

        const newPasteLines = pasteContent.slice(1);
        const remainingSerializedLyrics: Lyric[] = newPasteLines.map(
            (line: string): Lyric => {
                return new Lyric(line);
            }
        );

        const lastIndex = remainingSerializedLyrics.length - 1;
        remainingSerializedLyrics[lastIndex].append(
            serializedLyricsFromRange(afterSelection)
        );

        return [serializedLyricsForThisLine, remainingSerializedLyrics];
    };

    const handlePlainTextPaste = (
        event: React.ClipboardEvent<HTMLDivElement>
    ): boolean => {
        if (props.onLyricOverflow === undefined) {
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

        finish(newValue);
        props.onLyricOverflow(newPasteLines);
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

    const lyricContent = deserializeLyrics(props.children);

    return (
        <InputTypography
            classes={props.classes}
            variant={props.variant}
            display="inline"
            data-testid="LyricInput"
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
                {lyricContent}
            </span>
        </InputTypography>
    );
};

export default LyricInput;
