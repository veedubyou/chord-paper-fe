import { RootRef } from "@material-ui/core";
import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { IDable } from "../../common/ChordModel/Collection";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";

export const DNDChordType: "chord" = "chord";

export interface DNDChord {
    type: typeof DNDChordType;
    sourceBlockID: IDable<ChordBlock>;
    chord: string;
    handled: boolean;
}

export const NewDNDChord = (
    sourceBlockID: IDable<ChordBlock>,
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

interface ChordDropTargetProps {
    children: (isOver: boolean) => React.ReactElement<ClassNameable>;
    onDropped: ChordDroppableProps["onDropped"];
}

interface DropResult {
    isOver: boolean;
}

const ChordDropTarget: React.FC<ChordDropTargetProps> = (
    props: ChordDropTargetProps
) => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DNDChord, DropResult>({
        accept: DNDChordType,
        drop: (droppedChord: DNDChord, monitor: DropTargetMonitor) => {
            const dropResult = monitor.getDropResult();

            // the drop effect (i.e. move vs copy) can only be retrieved from the drop result,
            // which is the object that is returned by this fn (drop), with dropEffect shimmed in
            //
            // the drop result is always null the first time and therefore the drop effect cannot be
            // retrieved on the first interception of the drop event
            //
            // this handler is meant to be called twice - the first time where drop result is null
            // and the second time where drop result is not null, and the drop effect can be found
            //
            // this code is coupled with the returned component below, where two nested <ChordDropTarget>s are returned
            // to induce a valid drop result
            if (dropResult !== null && !droppedChord.handled) {
                droppedChord.handled = true;
                const isCopyAction: boolean = dropResult.dropEffect === "copy";

                props.onDropped(
                    droppedChord.chord,
                    droppedChord.sourceBlockID,
                    isCopyAction
                );
            }

            return droppedChord;
        },
        collect: (monitor: DropTargetMonitor): DropResult => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    return <RootRef rootRef={dropRef}>{props.children(isOver)}</RootRef>;
};

interface ChordDroppableProps {
    children: React.ReactElement<ClassNameable>;
    onDropped: (
        newChord: string,
        sourceBlockID: IDable<ChordBlock>,
        copyAction: boolean
    ) => void;
    hoverableClassName?: string;
    dragOverClassName?: string;
}

const ChordDroppable: React.FC<ChordDroppableProps> = (
    props: ChordDroppableProps
) => {
    const childrenWithClassname = (
        isOver: boolean
    ): React.ReactElement<ClassNameable> => {
        let childElem: React.ReactElement<ClassNameable> = props.children;
        const childClassName: string | undefined = isOver
            ? props.dragOverClassName
            : props.hoverableClassName;

        if (childClassName !== undefined) {
            childElem = React.cloneElement(childElem, {
                className: childClassName,
            });
        }

        return childElem;
    };

    return (
        // nested drop targets to get a drop result -
        // see the drop handler in ChordDropTarget for a thorough explanation
        <ChordDropTarget {...props}>
            {() => (
                <ChordDropTarget {...props}>
                    {childrenWithClassname}
                </ChordDropTarget>
            )}
        </ChordDropTarget>
    );
};

export default ChordDroppable;
