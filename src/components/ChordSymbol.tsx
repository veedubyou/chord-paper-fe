import React from "react";
import { Typography, Theme } from "@material-ui/core";
import { DataTestID } from "../common/DataTestID";
import { inflateIfEmpty } from "../common/Whitespace";
import { withStyles } from "@material-ui/styles";

const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        whiteSpace: "pre",
        "&:hover": {
            color: theme.palette.secondary.main,
        },
        cursor: "pointer",
    },
}))(Typography);

interface ChordSymbolProps extends DataTestID {
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
            variant="h5"
            display="inline"
            data-testid={props["data-testid"]}
        >
            {formattedChord()}
        </ChordTypography>
    );
};

export default ChordSymbol;
