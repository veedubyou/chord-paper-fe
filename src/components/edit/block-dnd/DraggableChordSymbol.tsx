import { RootRef } from "@material-ui/core";
import React from "react";
import { DragSourceMonitor, useDrag } from "react-dnd";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { IDable } from "../../../common/ChordModel/Collection";
import ChordSymbol, { ChordSymbolProps } from "../../display/ChordSymbol";
import { DNDChord, NewDNDChord } from "./common";
import { isDropResult } from "./useChordDrop";

interface DraggableChordSymbolProps extends ChordSymbolProps {
    chordBlockID: IDable<ChordBlock>;
    onDrop: (params: {
        chord: string;
        sourceBlockID: IDable<ChordBlock>;
        destinationBlockID: IDable<ChordBlock>;
        splitIndex: number;
        dropType: "move" | "copy";
    }) => void;
}

const DraggableChordSymbol: React.FC<DraggableChordSymbolProps> = (
    props: DraggableChordSymbolProps
): JSX.Element => {
    const [, dragRef] = useDrag({
        item: NewDNDChord(props.chordBlockID, props.children),
        end: (chord: DNDChord | undefined, monitor: DragSourceMonitor) => {
            if (chord === undefined) {
                return;
            }

            const dropResult = monitor.getDropResult();

            if (!isDropResult(dropResult)) {
                return;
            }

            props.onDrop({
                chord: chord.chord,
                sourceBlockID: chord.sourceBlockID,
                destinationBlockID: dropResult.blockID,
                splitIndex: dropResult.tokenIndex,
                dropType: dropResult.dropEffect,
            });
        },
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
