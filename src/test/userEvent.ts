import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

export const enterKey = (element: Element): void => {
    act(() => {
        fireEvent.keyDown(element, {
            key: "Enter",
            keyCode: 13,
            code: 13,
            charCode: 13,
        });

        fireEvent.keyPress(element, {
            key: "Enter",
            keyCode: 13,
            code: 13,
            charCode: 13,
        });

        fireEvent.keyUp(element, {
            key: "Enter",
            keyCode: 13,
            code: 13,
            charCode: 13,
        });
    });
};
