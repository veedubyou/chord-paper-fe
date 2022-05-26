import React, { useEffect } from "react";
import { ConnectDropTarget } from "react-dnd";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import { useChordDrop } from "./useChordDrop";

interface ChordTokenDroppableProps {
    children: (dropRef: ConnectDropTarget) => React.ReactElement;
    blockID: IDable<ChordBlock>;
    onDragOver: (isDraggingOver: boolean) => void;
}

const ChordTokenDroppable: React.FC<ChordTokenDroppableProps> = (
    props: ChordTokenDroppableProps
) => {
    const [dropRef, isOver] = useChordDrop(props.blockID, 0);

    const onDragOver = props.onDragOver;

    useEffect(() => {
        onDragOver(isOver);
    }, [onDragOver, isOver]);

    return props.children(dropRef);
};

export default ChordTokenDroppable;
