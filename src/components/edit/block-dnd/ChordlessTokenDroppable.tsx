import { RootRef } from "@material-ui/core";
import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import {
    ClassNameable,
    DNDChord,
    DNDChordType,
    DropCollector,
    DropParams,
    TypedDropParams,
} from "./common";

interface ChordlessTokenDroppableProps {
    children: React.ReactElement<ClassNameable>;
    hoverableClassName: string;
    dragOverClassName: string;
    dropParams: DropParams;
}

const ChordlessTokenDroppable: React.FC<ChordlessTokenDroppableProps> = (
    props: ChordlessTokenDroppableProps
): JSX.Element => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DropParams, DropCollector>({
        accept: DNDChordType,
        drop: (): TypedDropParams => {
            return {
                type: "dropped-chord-result",
                ...props.dropParams,
            };
        },
        collect: (monitor: DropTargetMonitor): DropCollector => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    const childClassName: string = isOver
        ? props.dragOverClassName
        : props.hoverableClassName;

    const childrenWithClassName = React.cloneElement(props.children, {
        className: childClassName,
    });

    return <RootRef rootRef={dropRef}>{childrenWithClassName}</RootRef>;
};

export default ChordlessTokenDroppable;
