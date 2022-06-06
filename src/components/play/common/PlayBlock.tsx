import { Box, Grid } from "@mui/material";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import ChordSymbol from "components/display/ChordSymbol";
import LyricTypography from "components/display/Lyric";
import React from "react";

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
                    <LyricTypography data-testid="lyric">
                        {props.block.lyric}
                    </LyricTypography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayBlock;
