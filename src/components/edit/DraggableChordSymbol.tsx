import { RootRef } from "@material-ui/core";
import React from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import ChordSymbol, { ChordSymbolProps } from "../display/ChordSymbol";
import { NewDNDChord, DNDChord } from "./ChordDroppable";
import { IDable } from "../../common/ChordModel/Collection";

interface DraggableChordSymbolProps extends ChordSymbolProps {
    chordBlockID: IDable<"ChordBlock">;
    onDragged?: () => void;
}

const DraggableChordSymbol: React.FC<DraggableChordSymbolProps> = (
    props: DraggableChordSymbolProps
): JSX.Element => {
    const [, dragRef] = useDrag({
        item: NewDNDChord(props.chordBlockID, props.children),
        collect: (monitor: DragSourceMonitor) => ({
            dropped: monitor.didDrop(),
            dndChord: monitor.getItem() as DNDChord | null,
        }),
    });

    return (
        <RootRef rootRef={dragRef}>
            <ChordSymbol className={props.className}>
                {props.children}
            </ChordSymbol>
        </RootRef>
    );
};

export default DraggableChordSymbol;
