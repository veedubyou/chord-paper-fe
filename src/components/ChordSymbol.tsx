import React from "react";
import { Typography, Theme } from "@material-ui/core";
import { inflateIfEmpty } from "../common/Whitespace";
import { withStyles } from "@material-ui/styles";

const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        cursor: "pointer",
        fontFamily: "PoriChord",
    },
}))(Typography);

interface ChordSymbolProps {
    children: string;
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
            variant="subtitle1"
            display="inline"
            data-testid="ChordSymbol"
        >
            {formattedChord()}
        </ChordTypography>
    );
};

export default ChordSymbol;
