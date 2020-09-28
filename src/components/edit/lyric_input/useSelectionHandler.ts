import { useEffect } from "react";
import { lyricTabTypeOfDOMNode } from "../../lyrics/Tab";
import { contentEditableElement } from "./SelectionUtils";

type HandlerFn = (selection: Selection) => boolean;

export const useFocusAndPlaceCaretEffect = (
    ref: React.RefObject<HTMLSpanElement>
): void => {
    useEffect(() => {
        const elem = contentEditableElement(ref);
        elem.focus();

        const selection = window.getSelection();
        if (selection === null) {
            return;
        }

        const newRange = document.createRange();
        newRange.selectNodeContents(elem);
        newRange.collapse(false);

        selection.removeAllRanges();
        selection.addRange(newRange);
    });
};

const handleSelectOpaqueBlock = (selection: Selection): boolean => {
    //todo, handle non collapsed selections
    if (!selection.isCollapsed) {
        return false;
    }

    const range = selection.getRangeAt(0);
    // not embedded in a non contenteditable
    if (lyricTabTypeOfDOMNode(range.endContainer) === null) {
        return false;
    }

    range.setStartAfter(range.endContainer);
    range.setEndAfter(range.endContainer);
    range.collapse(true);
    return true;
};

const handlers: HandlerFn[] = [handleSelectOpaqueBlock];

const handleSelectionChange = (event: Event) => {
    const selection = document.getSelection();
    if (selection === null || selection.rangeCount !== 1) {
        return;
    }

    for (const handler of handlers) {
        const handled = handler(selection);
        if (handled) {
            event.preventDefault();
            return;
        }
    }
};

export const useSelectionChangeEffect = () => {
    useEffect(() => {
        document.addEventListener("selectionchange", handleSelectionChange);

        return () =>
            document.removeEventListener(
                "selectionchange",
                handleSelectionChange
            );
    });
};
