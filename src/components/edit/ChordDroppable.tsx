import { RootRef } from "@material-ui/core";
import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { IDable } from "../../common/ChordModel/Collection";

export const DNDChordType: "chord" = "chord";

export interface DNDChord {
    type: typeof DNDChordType;
    sourceBlockID: IDable<"ChordBlock">;
    chord: string;
    handled: boolean;
}

export const NewDNDChord = (
    sourceBlockID: IDable<"ChordBlock">,
    chord: string
): DNDChord => {
    return {
        type: DNDChordType,
        sourceBlockID: sourceBlockID,
        chord: chord,
        handled: false,
    };
};

interface ClassNameable {
    className?: string;
}

interface ChordDroppableProps {
    children: React.ReactElement<ClassNameable>;
    onDropped: (newChord: string, sourceBlockID: IDable<"ChordBlock">) => void;
    hoverableClassName?: string;
    dragOverClassName?: string;
}

const ChordDroppable: React.FC<ChordDroppableProps> = (
    props: ChordDroppableProps
) => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DNDChord, any>({
        accept: DNDChordType,
        drop: (droppedChord: DNDChord) => {
            if (!droppedChord.handled) {
                droppedChord.handled = true;
                props.onDropped(droppedChord.chord, droppedChord.sourceBlockID);
            }
            return droppedChord;
        },
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    let childElem: React.ReactElement<ClassNameable> = props.children;
    const childClassName: string | undefined = isOver
        ? props.dragOverClassName
        : props.hoverableClassName;

    if (childClassName !== undefined) {
        childElem = React.cloneElement(childElem, {
            className: childClassName,
        });
    }

    return <RootRef rootRef={dropRef}>{childElem}</RootRef>;
};

export default ChordDroppable;
