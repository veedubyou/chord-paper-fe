import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

type KeyOption = typeof fireEvent.keyDown extends (
    arg1: any,
    args: infer U
) => any
    ? U
    : never;

export const KeyOptions = {
    enter: {
        key: "Enter",
        keyCode: 13,
        charCode: 13,
    },
    tab: {
        key: "Tab",
        keyCode: 9,
        charCode: 0,
    },
    left: {
        key: "ArrowLeft",
        keyCode: 37,
        charCode: 0,
    },
    right: {
        key: "ArrowRight",
        keyCode: 39,
        charCode: 0,
    },
    backspace: {
        key: "Backspace",
        keyCode: 8,
        charCode: 0,
    },
};

export const pressKey = (
    element: Element,
    keyOptions: KeyOption,
    shift?: boolean
): void => {
    const key = {
        shiftKey: shift,
        ...keyOptions,
    };

    act(() => {
        fireEvent.keyDown(element, key);
        fireEvent.keyPress(element, key);
        fireEvent.keyUp(element, key);
    });
};

export const changeInputText = (
    elem: HTMLElement,
    newText: string
): never | void => {
    if (elem.tagName.toLowerCase() !== "input") {
        throw new Error("element must be an input");
    }

    fireEvent.change(elem, {
        target: { value: newText },
    });
};

export const changeContentEditableText = (
    elem: HTMLElement,
    newText: string
) => {
    // finding out contenteditable like this instead of elem.contentEditable
    // since it seems to be returning undefined. perhaps because the render was not done?
    if (elem.getAttribute("contenteditable") !== "true") {
        throw new Error("element must be contenteditable");
    }

    fireEvent.change(elem, {
        target: { textContent: newText },
    });
};
