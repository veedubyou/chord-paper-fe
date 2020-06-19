import React from "react";
import { Typography, Theme } from "@material-ui/core";
import { inflateIfEmpty } from "../common/Whitespace";
import { withStyles } from "@material-ui/styles";
import { lyricTypographyVariant } from "./LyricToken";
import { outline } from "./Outline";

const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        cursor: "pointer",
        fontFamily: "PoriChord",
    },
}))(Typography);

const HighlightedChordBox = withStyles((theme: Theme) => ({
    root: {
        ...outline(theme),
        color: theme.palette.primary.dark,
    },
}))(ChordTypography);

interface ChordSymbolProps {
    children: string;
    highlight?: boolean;
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

    const TypographyComponent =
        props.highlight === true ? HighlightedChordBox : ChordTypography;

    return (
        <TypographyComponent
            variant={lyricTypographyVariant} // keep chords and lyrics the same size
            display="inline"
            data-testid="ChordSymbol"
        >
            {formattedChord()}
        </TypographyComponent>
    );
};

export default ChordSymbol;
