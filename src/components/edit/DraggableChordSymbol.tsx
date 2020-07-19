import { RootRef } from "@material-ui/core";
import React from "react";
import { useDrag } from "react-dnd";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { IDable } from "../../common/ChordModel/Collection";
import ChordSymbol, { ChordSymbolProps } from "../display/ChordSymbol";
import { NewDNDChord } from "./ChordDroppable";

interface DraggableChordSymbolProps extends ChordSymbolProps {
    chordBlockID: IDable<ChordBlock>;
    onDragged?: () => void;
}

const DraggableChordSymbol: React.FC<DraggableChordSymbolProps> = (
    props: DraggableChordSymbolProps
): JSX.Element => {
    const [, dragRef] = useDrag({
        item: NewDNDChord(props.chordBlockID, props.children),
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
