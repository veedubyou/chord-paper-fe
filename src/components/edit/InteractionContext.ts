import { noopFn, PlainFn } from "common/PlainFn";
import React, { useContext, useState } from "react";

export interface InteractionSetter {
    startInteraction: PlainFn;
    endInteraction: PlainFn;
}

const defaultSetter: InteractionSetter = {
    startInteraction: noopFn,
    endInteraction: noopFn,
};

export const InteractionContext =
    React.createContext<InteractionSetter>(defaultSetter);

interface EditingState {
    editing: boolean;
    startEdit: PlainFn;
    finishEdit: PlainFn;
}

export const useEditingState = (): EditingState => {
    const [editing, setEditing] = useState(false);
    const { startInteraction, endInteraction } = useContext(InteractionContext);

    const startEdit = () => {
        setEditing(true);
        startInteraction();
    };

    const finishEdit = () => {
        setEditing(false);
        endInteraction();
    };

    return {
        editing: editing,
        startEdit: startEdit,
        finishEdit: finishEdit,
    };
};
