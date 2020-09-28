import { makeStyles, Typography, TypographyVariant } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { StyledComponentProps, withStyles } from "@material-ui/styles";
import React from "react";
import { Lyric } from "../../../common/ChordModel/Lyric";
import { PlainFn } from "../../../common/PlainFn";
import { deserializeLyrics, serializeLyrics } from "../../lyrics/Serialization";
import { contentEditableElement } from "./SelectionUtils";
import { KeyDownHandlerProps, useKeyDownHandler } from "./useKeyHandler";
import { PasteHandlerProps, usePasteHandler } from "./usePasteHandler";
import {
    useFocusAndPlaceCaretEffect,
    useSelectionChangeEffect,
} from "./useSelectionHandler";

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
    onFinish: (newValue: Lyric) => void;
    onSpecialBackspace: PlainFn;
    onLyricOverflow: (overflowContent: Lyric[]) => void;
    onJSONPaste: (jsonStr: string) => boolean;
    variant?: TypographyVariant;
}

const LyricInput: React.FC<LyricInputProps> = (
    props: LyricInputProps
): JSX.Element => {
    const contentEditableRef: React.RefObject<HTMLSpanElement> = React.createRef();

    const value = (): Lyric => {
        const elem = contentEditableElement(contentEditableRef);
        if (elem.textContent === null) {
            return new Lyric("");
        }

        return serializeLyrics(elem.childNodes);
    };

    const finish = (newValue: Lyric) => {
        props.onFinish(newValue);
    };

    const keyDownHandlerProps: KeyDownHandlerProps = {
        contentEditableRef: contentEditableRef,
        enterCallback: () => {
            finish(value());
        },
        specialBackspaceCallback: () => {
            props.onSpecialBackspace();
        },
        specialEnterCallback: (
            beforeSelection: Lyric,
            afterSelection: Lyric
        ) => {
            finish(beforeSelection);
            props.onLyricOverflow([afterSelection]);
        },
    };

    const handleKeyDown = useKeyDownHandler(keyDownHandlerProps);

    const pasteHandlerProps: PasteHandlerProps = {
        contentEditableRef: contentEditableRef,
        pasteJSONCallback: (payload: string): boolean => {
            const handled = props.onJSONPaste(payload);
            if (handled) {
                finish(value());
            }
            return handled;
        },
        pastePlainTextCallback: (firstLine: Lyric, restOfLines: Lyric[]) => {
            finish(firstLine);
            props.onLyricOverflow(restOfLines);
        },
    };

    const handlePaste = usePasteHandler(pasteHandlerProps);

    const handleBlur = () => {
        finish(value());
    };

    const contentEditableStyle = useContentEditableStyle();
    const lyricContent = deserializeLyrics(props.children);

    useFocusAndPlaceCaretEffect(contentEditableRef);
    useSelectionChangeEffect();

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
                // onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                suppressContentEditableWarning
            >
                {lyricContent}
            </span>
        </InputTypography>
    );
};

export default LyricInput;
