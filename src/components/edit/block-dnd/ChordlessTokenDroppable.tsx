import { RootRef } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import { ClassNameable } from "./common";
import { useChordDrop } from "./useChordDrop";

interface ChordlessTokenDroppableProps {
    children: React.ReactElement<ClassNameable>;
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

    const childrenWithClassName = React.cloneElement(props.children, {
        className: childClassName,
    });

    return <RootRef rootRef={dropRef}>{childrenWithClassName}</RootRef>;
};

export default ChordlessTokenDroppable;
