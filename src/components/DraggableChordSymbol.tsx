import { RootRef } from "@material-ui/core";
import React from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import ChordSymbol, { ChordSymbolProps } from "./ChordSymbol";
import { NewDNDChord, DNDChord } from "./DNDChord";
import { IDable } from "../common/ChordModel/Collection";

interface DraggableChordSymbolProps extends ChordSymbolProps {
    chordBlockID: IDable<"ChordBlock">;
    onDragged?: () => void;
}

const DraggableChordSymbol: React.FC<DraggableChordSymbolProps> = (
    props: DraggableChordSymbolProps
): JSX.Element => {
    const [{ dropped, dndChord }, dragRef] = useDrag({
        item: NewDNDChord(props.chordBlockID, props.children),
        collect: (monitor: DragSourceMonitor) => ({
            dropped: monitor.didDrop(),
            dndChord: monitor.getItem() as DNDChord | null,
        }),
    });

    const shouldHandleChordDrop = (dndChord: DNDChord | null): boolean => {
        if (dndChord === null) {
            return false;
        }

        return (
            dndChord.sourceBlockID === props.chordBlockID && !dndChord.handled
        );
    };

    if (dropped && shouldHandleChordDrop(dndChord)) {
        dndChord!.handled = true;

        console.log("DROPPED FOR", props.chordBlockID, props.children);
        if (props.onDragged) {
            props.onDragged();
        }
    }

    return (
        <RootRef rootRef={dragRef}>
            <ChordSymbol className={props.className}>
                {props.children}
            </ChordSymbol>
        </RootRef>
    );
};

export default DraggableChordSymbol;
