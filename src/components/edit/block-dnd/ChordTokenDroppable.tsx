import { RootRef } from "@material-ui/core";
import React, { useEffect } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import {
    DNDChord,
    DNDChordType,
    DropCollector,
    DropParams,
    TypedDropParams,
} from "./common";

interface ChordTokenDroppableProps {
    children: React.ReactElement;
    blockID: IDable<ChordBlock>;
    onDragOver: (isDraggingOver: boolean) => void;
}

const ChordTokenDroppable: React.FC<ChordTokenDroppableProps> = (
    props: ChordTokenDroppableProps
) => {
    const [{ isOver }, dropRef] = useDrop<DNDChord, DropParams, DropCollector>({
        accept: DNDChordType,
        drop: (): TypedDropParams => {
            console.log("dropping");
            return {
                type: "dropped-chord-result",
                tokenIndex: 0,
                blockID: props.blockID,
            };
        },
        collect: (monitor: DropTargetMonitor): DropCollector => ({
            isOver: monitor.isOver({ shallow: true }),
        }),
    });

    const onDragOver = props.onDragOver;

    useEffect(() => {
        onDragOver(isOver);
    }, [onDragOver, isOver]);

    return <RootRef rootRef={dropRef}>{props.children}</RootRef>;
};

export default ChordTokenDroppable;
