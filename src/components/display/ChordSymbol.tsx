import { Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React from "react";
import { inflateIfEmpty } from "../../common/Whitespace";
import { lyricTypographyVariant } from "./Lyric";

const ChordTypography = withStyles({
    root: {
        whiteSpace: "pre",
        cursor: "pointer",
        fontFamily: "PoriChord",
        userSelect: "all",
    },
})(Typography);

export interface ChordSymbolProps {
    children: string;
    className?: string;
}

const ChordSymbol: React.FC<ChordSymbolProps> = (
    props: ChordSymbolProps
): JSX.Element => {
    const formattedChord = (): string => {
        let chord = props.children;
        if (chord.endsWith(" ")) {
            return chord;
        }

        chord = chord + " ";

        return inflateIfEmpty(chord);
    };

    return (
        <ChordTypography
            variant={lyricTypographyVariant} // keep chords and lyrics the same size
            display="inline"
            data-testid="ChordSymbol"
            className={props.className}
        >
            {formattedChord()}
        </ChordTypography>
    );
};

export default ChordSymbol;
