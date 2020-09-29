import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

type Key = typeof fireEvent.keyDown extends (arg1: any, args: infer U) => any
    ? U
    : never;

type KeyOption = {
    shiftKey?: boolean;
    altKey?: boolean;
};

export const Keys = {
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
    key: Key,
    option?: KeyOption
): void => {
    const eventKey = {
        ...option,
        ...key,
    };

    act(() => {
        fireEvent.keyDown(element, eventKey);
        fireEvent.keyPress(element, eventKey);
        fireEvent.keyUp(element, eventKey);
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
