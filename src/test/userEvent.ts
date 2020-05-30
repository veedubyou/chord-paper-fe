import { findByTestIdChain } from "./matcher";
import { fireEvent } from "@testing-library/react";

export const enterKey = (element: Element): void => {
    fireEvent.keyPress(element, {
        key: "Enter",
        code: 13,
        charCode: 13,
    });
};

export const backspaceKey = (element: Element): void => {
    fireEvent.keyPress(element, {
        key: "Backspace",
        code: 8,
        charCode: 8,
    });
};
