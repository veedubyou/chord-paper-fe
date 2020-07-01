import React from "react";

export interface InteractionSetter {
    startInteraction: () => void;
    endInteraction: () => void;
}

const defaultSetter: InteractionSetter = {
    startInteraction: () => {},
    endInteraction: () => {},
};

export const InteractionContext = React.createContext<InteractionSetter>(
    defaultSetter
);
