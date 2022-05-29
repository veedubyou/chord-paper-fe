import React from "react";
import { ConnectDropTarget } from "react-dnd";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import { ClassNameable } from "./common";
import { useChordDrop } from "./useChordDrop";

interface ChordlessTokenDroppableProps {
    children: (
        dropTargetRef: ConnectDropTarget
    ) => React.ReactElement<ClassNameable>;
    hoverableClassName: string;
    dragOverClassName: string;
    blockID: IDable<ChordBlock>;
    tokenIndex: number;
}

const ChordlessTokenDroppable: React.FC<ChordlessTokenDroppableProps> = (
    props: ChordlessTokenDroppableProps
): JSX.Element => {
    const [dropRef, isOver] = useChordDrop(props.blockID, props.tokenIndex);

    const childClassName: string = isOver
        ? props.dragOverClassName
        : props.hoverableClassName;

    const childElement = props.children(dropRef);

    const childrenWithClassName = React.cloneElement(childElement, {
        className: childClassName,
    });

    return childrenWithClassName;
};

export default ChordlessTokenDroppable;
