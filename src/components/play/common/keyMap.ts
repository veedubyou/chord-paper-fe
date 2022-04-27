const isControlCommand = (event: KeyboardEvent): boolean => {
    return event.ctrlKey || event.metaKey;
};

const navigateBackwardsKeys: string[] = [
    "ArrowUp",
    "ArrowLeft",
    "Backspace",
    "ShiftLeft",
    "PageUp",
];

export const isNavigateBackwardsKey = (event: KeyboardEvent): boolean => {
    if (isControlCommand(event)) {
        return false;
    }

    for (let backwardsKey of navigateBackwardsKeys) {
        if (backwardsKey === event.code) {
            return true;
        }
    }

    return false;
};

const navigateForwardKeys: string[] = [
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyY",
    "KeyZ",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "Digit0",
    "Space",
    "Enter",
    "ArrowDown",
    "ArrowRight",
    "PageDown",
    "Comma",
    "Period",
    "Slash",
    "Backslash",
    "Semicolon",
    "Quote",
    "Backquote",
    "Tab",
    "ShiftRight",
    "Equal",
    "BracketLeft",
    "BracketRight",
];

export const isNavigateForwardsKey = (event: KeyboardEvent): boolean => {
    if (isControlCommand(event)) {
        return false;
    }

    for (let forwardsKey of navigateForwardKeys) {
        if (forwardsKey === event.code) {
            return true;
        }
    }

    return false;
};
