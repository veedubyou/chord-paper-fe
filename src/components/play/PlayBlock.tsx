import { Box, Grid } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import ChordSymbol from "../display/ChordSymbol";
import Lyric from "../display/Lyric";
import { withStyles } from "@material-ui/styles";

interface PlayBlockProps {
    block: ChordBlock;
}

const PlayBlock: React.FC<PlayBlockProps> = (
    props: PlayBlockProps
): JSX.Element => {
    return (
        <Box display="inline-block">
            <Grid container direction="column" component="span">
                <Grid item>
                    <ChordSymbol>{props.block.chord}</ChordSymbol>
                </Grid>
                <Grid item>
                    <Lyric data-testid="lyric">{props.block.lyric}</Lyric>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayBlock;
