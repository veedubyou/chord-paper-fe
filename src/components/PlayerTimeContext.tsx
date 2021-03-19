import React, { createRef, useRef } from "react";

export type GetPlayerTimeFn = () => number;
type GetPlayerTimeFnRef = React.MutableRefObject<GetPlayerTimeFn | null>;

export const PlayerTimeContext = React.createContext<GetPlayerTimeFnRef>(
    createRef()
);

interface PlayerTimeProviderProps {
    children: React.ReactNode;
}

const PlayerTimeProvider: React.FC<PlayerTimeProviderProps> = (
    props: PlayerTimeProviderProps
) => {
    const getPlayerTimeRef: GetPlayerTimeFnRef = useRef<GetPlayerTimeFn | null>(
        null
    );

    return (
        <PlayerTimeContext.Provider value={getPlayerTimeRef}>
            {props.children}
        </PlayerTimeContext.Provider>
    );
};

export default PlayerTimeProvider;
