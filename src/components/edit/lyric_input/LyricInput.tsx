import { styled, Theme, Typography, TypographyVariant } from "@mui/material";
import { grey } from "@mui/material/colors";
import { MUIStyledCommonProps, SystemStyleObject } from "@mui/system";
import React from "react";
import { Lyric } from "../../../common/ChordModel/Lyric";
import { PlainFn } from "../../../common/PlainFn";
import { deserializeLyrics, serializeLyrics } from "../../lyrics/Serialization";
import { contentEditableElement } from "./SelectionUtils";
import { KeyDownHandlerProps, useKeyDownHandler } from "./useKeyHandler";
import { PasteHandlerProps, usePasteHandler } from "./usePasteHandler";
import {
    useFocusAndPlaceCaretEffect,
    useSelectionChangeEffect
} from "./useSelectionHandler";

const InputTypography = styled(Typography)({
    width: "100%",
    backgroundColor: grey[200],
    whiteSpace: "pre",
    display: "inline-block",
});

const contentEditableStyle: SystemStyleObject<Theme> = {
    display: "inline-block",
    width: "100%",
    pointerEvents: "auto",
    userSelect: "text",
    outline: "none",
    wordSpacing: ".15em",
    // this prevent the span height from collapsing if there's no content
    "&:empty:before": {
        content: '"\\a0"',
    },
};

export interface LyricInputProps extends MUIStyledCommonProps<Theme> {
    children: Lyric;
    onFinish: (newValue: Lyric) => void;
    onSpecialBackspace: PlainFn;
    onSpecialEnter: (splitIndex: number) => void;
    onLyricOverflow: (overflowContent: Lyric[]) => void;
    onJSONPaste: (jsonStr: string) => [boolean, PlainFn | null];
    variant?: TypographyVariant;
}

const LyricInput: React.FC<LyricInputProps> = (
    props: LyricInputProps
): JSX.Element => {
    const contentEditableRef: React.RefObject<HTMLSpanElement> =
        React.createRef();

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
        specialEnterCallback: (splitIndex: number) => {
            finish(value());
            props.onSpecialEnter(splitIndex);
        },
    };

    const handleKeyDown = useKeyDownHandler(keyDownHandlerProps);

    const pasteHandlerProps: PasteHandlerProps = {
        contentEditableRef: contentEditableRef,
        pasteJSONCallback: (payload: string): boolean => {
            const [canHandle, executePaste] = props.onJSONPaste(payload);
            if (canHandle) {
                finish(value());
                executePaste?.();
            }

            return canHandle;
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

    const lyricContent = deserializeLyrics(props.children, true);

    useFocusAndPlaceCaretEffect(contentEditableRef);
    useSelectionChangeEffect();

    return (
        <InputTypography
            sx={props.sx}
            variant={props.variant}
            display="inline"
            data-testid="LyricInput"
        >
            <span
                contentEditable
                spellCheck={false}
                style={contentEditableStyle}
                ref={contentEditableRef}
                data-testid="InnerInput"
                onBlur={handleBlur}
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
