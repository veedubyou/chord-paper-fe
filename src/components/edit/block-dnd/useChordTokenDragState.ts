import { DragOverHandler } from "components/edit/block-dnd/common";
import { List } from "immutable";
import { useCallback, useReducer } from "react";

type SetDragOverAction = {
    index: number;
    isDraggingOver: boolean;
};

const reducer = (
    list: List<boolean>,
    action: SetDragOverAction
): List<boolean> => {
    return list.set(action.index, action.isDraggingOver);
};

export const useChordTokenDragState = (
    hoverableClassName: string,
    dragOverClassName: string
): [string, DragOverHandler, DragOverHandler] => {
    const [dragOverState, dispatch] = useReducer(reducer, List([false, false]));

    const getValue = (index: number): boolean => {
        const value = dragOverState.get(index);
        if (value === undefined) {
            throw new Error("Out of index error");
        }

        return value;
    };

    const handlers = [
        useCallback(
            (isDraggingOver: boolean) =>
                dispatch({
                    index: 0,
                    isDraggingOver: isDraggingOver,
                }),
            [dispatch]
        ),
        useCallback(
            (isDraggingOver: boolean) =>
                dispatch({
                    index: 1,
                    isDraggingOver: isDraggingOver,
                }),
            [dispatch]
        ),
    ];

    const isDragging = getValue(0) || getValue(1);
    const gridClassName = isDragging ? dragOverClassName : hoverableClassName;

    return [gridClassName, handlers[0], handlers[1]];
};
