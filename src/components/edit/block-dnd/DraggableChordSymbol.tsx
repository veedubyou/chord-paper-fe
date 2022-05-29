import React, { useCallback } from "react";
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

const DraggableChordSymbol = React.forwardRef(
    (
        props: DraggableChordSymbolProps,
        ref: React.ForwardedRef<Element>
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

        const combinedRefCallback = useCallback(
            (chordSymbolRef: HTMLSpanElement | null) => {
                dragRef(chordSymbolRef);
                if (ref !== null) {
                    if (typeof ref === "function") {
                        ref(chordSymbolRef);
                    } else {
                        ref.current = chordSymbolRef;
                    }
                }
            },
            [dragRef, ref]
        );

        return (
            <ChordSymbol className={props.className} ref={combinedRefCallback}>
                {props.children}
            </ChordSymbol>
        );
    }
);

export default DraggableChordSymbol;
