import React, { useRef } from "react";

export type GetPlayerTimeFn = () => number | null;
type GetPlayerTimeFnRef = React.MutableRefObject<GetPlayerTimeFn>;

const nullContextRef = {
    current: () => null,
};

export const PlayerTimeContext =
    React.createContext<GetPlayerTimeFnRef>(nullContextRef);

interface PlayerTimeProviderProps {
    children: React.ReactNode;
}

const PlayerTimeProvider: React.FC<PlayerTimeProviderProps> = (
    props: PlayerTimeProviderProps
) => {
    const getPlayerTimeRef: GetPlayerTimeFnRef = useRef<GetPlayerTimeFn>(
        () => null
    );

    return (
        <PlayerTimeContext.Provider value={getPlayerTimeRef}>
            {props.children}
        </PlayerTimeContext.Provider>
    );
};

export default PlayerTimeProvider;
