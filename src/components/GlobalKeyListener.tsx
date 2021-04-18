import React, { useContext, useEffect, useState } from "react";

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
    const [keyListeners, setKeyListeners] = useState<KeyListener[]>([]);

    console.log("rerender");

    const registerKeyListener = (listener: KeyListener) => {
        const newKeyListeners = keyListeners.concat(listener);
        setKeyListeners(newKeyListeners);
    };

    const registerTopKeyListener = (listener: KeyListener) => {
        const newKeyListeners = [listener].concat(keyListeners);
        setKeyListeners(newKeyListeners);
    };

    const unregisterKeyListener = (listener: KeyListener) => {
        const index = keyListeners.findIndex(
            (value: KeyListener) => value === listener
        );
        if (index === -1) {
            return;
        }

        keyListeners.splice(index, 1);
        setKeyListeners(keyListeners.concat());
    };

    // useEffect(() => {
    //     for (let listener of keyListeners) {
    //         window.addEventListener("keydown", listener);
    //     }

    //     return () => {
    //         for (let listener of keyListeners) {
    //             window.removeEventListener("keydown", listener);
    //         }
    //     };
    // }, [keyListeners]);

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
