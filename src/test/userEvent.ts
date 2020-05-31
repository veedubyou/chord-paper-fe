import { findByTestIdChain } from "./matcher";
import { fireEvent } from "@testing-library/react";

export const enterKey = (element: Element): void => {
    fireEvent.keyPress(element, {
        key: "Enter",
        keyCode: 13,
        code: 13,
        charCode: 13,
    });
};
