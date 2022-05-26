import { styled, Typography } from "@mui/material";
import React from "react";
import { inflateIfEmpty } from "../../common/Whitespace";
import { lyricTypographyVariant } from "./Lyric";

const ChordTypography = styled(Typography)({
    whiteSpace: "pre",
    cursor: "pointer",
    fontFamily: "PoriChord",
    userSelect: "all",
});

export interface ChordSymbolProps {
    children: string;
    className?: string;
}

const ChordSymbol = React.forwardRef(
    (
        props: ChordSymbolProps,
        ref: React.ForwardedRef<HTMLSpanElement>
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
                ref={ref}
            >
                {formattedChord()}
            </ChordTypography>
        );
    }
);

export default ChordSymbol;
