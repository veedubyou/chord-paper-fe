import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

export const enterKey = (element: Element): void => {
    act(() => {
        fireEvent.keyDown(element, {
            key: "Enter",
            keyCode: 13,
            charCode: 13,
        });

        fireEvent.keyPress(element, {
            key: "Enter",
            keyCode: 13,
            charCode: 13,
        });

        fireEvent.keyUp(element, {
            key: "Enter",
            keyCode: 13,
            charCode: 13,
        });
    });
};

export const tabKey = (element: Element, shift: boolean): void => {
    act(() => {
        fireEvent.keyDown(element, {
            key: "Tab",
            keyCode: 9,
            charCode: 0,
            shiftKey: shift,
        });

        fireEvent.keyPress(element, {
            key: "Tab",
            keyCode: 9,
            charCode: 0,
            shiftKey: shift,
        });

        fireEvent.keyUp(element, {
            key: "Tab",
            keyCode: 9,
            charCode: 0,
            shiftKey: shift,
        });
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
