const scrollBackwardsKeys: string[] = [
    "ArrowUp",
    "ArrowLeft",
    "Backspace",
    "ShiftLeft",
];

export const isScrollBackwardsKey = (code: string): boolean => {
    for (let backwardsKey of scrollBackwardsKeys) {
        if (backwardsKey === code) {
            return true;
        }
    }

    return false;
};

export const scrollForwardKeys: string[] = [
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

export const isScrollForwardsKey = (code: string): boolean => {
    for (let forwardsKey of scrollForwardKeys) {
        if (forwardsKey === code) {
            return true;
        }
    }

    return false;
};
