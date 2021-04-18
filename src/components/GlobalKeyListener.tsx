import React, { useContext, useRef } from "react";

type KeyListener = (event: KeyboardEvent) => void;
type RegisterKeyListenerFn = (listener: KeyListener) => void;

const GlobalKeyListenerContext = React.createContext<
    [RegisterKeyListenerFn, RegisterKeyListenerFn, RegisterKeyListenerFn]
>([() => {}, () => {}, () => {}]);

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
    const keyListeners = useRef<KeyListener[]>([]);

    const removeAll = () => {
        for (let listener of keyListeners.current) {
            window.removeEventListener("keydown", listener);
        }
    };

    const addAll = () => {
        for (let listener of keyListeners.current) {
            window.addEventListener("keydown", listener);
        }
    };

    const registerKeyListener = (listener: KeyListener) => {
        keyListeners.current.push(listener);
        window.addEventListener("keydown", listener);
    };

    const registerTopKeyListener = (listener: KeyListener) => {
        removeAll();
        keyListeners.current.unshift(listener);
        addAll();
    };

    const unregisterKeyListener = (listener: KeyListener) => {
        const index = keyListeners.current.findIndex(
            (value: KeyListener) => value === listener
        );
        if (index === -1) {
            return;
        }

        keyListeners.current.splice(index, 1);
        window.removeEventListener("keydown", listener);
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
