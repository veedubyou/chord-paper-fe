import React from "react";
import {
    Typography,
    Theme,
    StyledComponentProps,
    RootRef,
} from "@material-ui/core";
import { inflateIfEmpty } from "../common/Whitespace";
import { withStyles } from "@material-ui/styles";
import { lyricTypographyVariant, ChordTargetBox } from "./LyricToken";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { NewDNDChord } from "./DNDChord";

const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        cursor: "pointer",
        fontFamily: "PoriChord",
    },
}))(Typography);

interface ChordSymbolProps {
    children: string;
    className?: string;
}

const ChordSymbol: React.FC<ChordSymbolProps> = (
    props: ChordSymbolProps
): JSX.Element => {
    const [{ dropped }, dragRef] = useDrag({
        item: NewDNDChord(props.children),
        collect: (monitor: DragSourceMonitor) => ({
            dropped: monitor.didDrop(),
        }),
    });

    console.log("ChordSymbol dropped", dropped);

    const formattedChord = (): string => {
        let chord = props.children;
        if (chord.endsWith(" ")) {
            return chord;
        }

        chord = chord + " ";

        return inflateIfEmpty(chord);
    };

    return (
        <RootRef rootRef={dragRef}>
            <ChordTypography
                variant={lyricTypographyVariant} // keep chords and lyrics the same size
                display="inline"
                data-testid="ChordSymbol"
                className={props.className}
            >
                {formattedChord()}
            </ChordTypography>
        </RootRef>
    );
};

export default ChordSymbol;
