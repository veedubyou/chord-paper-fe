import React, { useContext, useRef } from "react";
import { noopFn } from "../common/PlainFn";

type KeyListener = (event: KeyboardEvent) => void;
interface StoredKeyListener {
    original: KeyListener;
    wrapped: KeyListener;
}
type RegisterKeyListenerFn = (listener: KeyListener) => void;

const GlobalKeyListenerContext = React.createContext<
    [RegisterKeyListenerFn, RegisterKeyListenerFn, RegisterKeyListenerFn]
>([noopFn, noopFn, noopFn]);

interface GlobalKeyListenerProviderProps {
    children: React.ReactNode;
}

export const useRegisterKeyListener = (): [
    RegisterKeyListenerFn,
    RegisterKeyListenerFn
] => {
    const [registerKeyListener, , unregisterKeyListener] = useContext(
        GlobalKeyListenerContext
    );
    return [registerKeyListener, unregisterKeyListener];
};

export const useRegisterTopKeyListener = (): [
    RegisterKeyListenerFn,
    RegisterKeyListenerFn
] => {
    const [, registerTopKeyListener, unregisterKeyListener] = useContext(
        GlobalKeyListenerContext
    );
    return [registerTopKeyListener, unregisterKeyListener];
};

const GlobalKeyListenerProvider: React.FC<GlobalKeyListenerProviderProps> = (
    props: GlobalKeyListenerProviderProps
): JSX.Element => {
    const keyListeners = useRef<StoredKeyListener[]>([]);

    const removeAll = () => {
        for (let entry of keyListeners.current) {
            window.removeEventListener("keydown", entry.wrapped, true);
        }
    };

    const addAll = () => {
        for (let entry of keyListeners.current) {
            window.addEventListener("keydown", entry.wrapped, true);
        }
    };

    const wrapListener = (listener: KeyListener): KeyListener => {
        return (event: KeyboardEvent): void => {
            const isTypingContext =
                event.target instanceof HTMLElement &&
                (event.target.tagName === "INPUT" ||
                    event.target.tagName === "TEXTAREA" ||
                    event.target.isContentEditable);

            if (isTypingContext) {
                return;
            }

            listener(event);

            if (event.defaultPrevented) {
                event.stopImmediatePropagation();
            }
            return;
        };
    };

    const registerKeyListener = (listener: KeyListener) => {
        const wrappedListener = wrapListener(listener);

        keyListeners.current.push({
            original: listener,
            wrapped: wrappedListener,
        });

        window.addEventListener("keydown", wrappedListener, true);
    };

    const registerTopKeyListener = (listener: KeyListener) => {
        const wrappedListener = wrapListener(listener);

        removeAll();
        keyListeners.current.unshift({
            original: listener,
            wrapped: wrappedListener,
        });
        addAll();
    };

    const unregisterKeyListener = (listener: KeyListener) => {
        const index = keyListeners.current.findIndex(
            (entry: StoredKeyListener) => entry.original === listener
        );
        if (index === -1) {
            return;
        }

        const entry = keyListeners.current[index];

        window.removeEventListener("keydown", entry.wrapped, true);
        keyListeners.current.splice(index, 1);
    };

    return (
        <GlobalKeyListenerContext.Provider
            value={[
                registerKeyListener,
                registerTopKeyListener,
                unregisterKeyListener,
            ]}
        >
            {props.children}
        </GlobalKeyListenerContext.Provider>
    );
};

export default GlobalKeyListenerProvider;
