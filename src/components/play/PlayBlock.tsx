import { Box, Grid, Typography as UnstyledTypography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import ChordSymbol from "../display/ChordSymbol";

const Typography = withStyles({
    root: {
        whiteSpace: "pre",
    },
})(UnstyledTypography);

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
                    <Typography variant="h6" display="inline">
                        {props.block.lyric}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayBlock;
