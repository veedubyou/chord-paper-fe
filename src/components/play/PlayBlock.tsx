import { Box, Grid } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import ChordSymbol from "../display/ChordSymbol";
import Lyric from "../display/Lyric";

interface PlayBlockProps {
    block: ChordBlock;
}

const PlayBlock: React.FC<PlayBlockProps> = (
    props: PlayBlockProps
): JSX.Element => {
    //TODO: fix this shit
    const lyric: string = props.block.lyric.get((rawStr: string) => rawStr);

    return (
        <Box display="inline-block">
            <Grid container direction="column" component="span">
                <Grid item>
                    <ChordSymbol>{props.block.chord}</ChordSymbol>
                </Grid>
                <Grid item>
                    <Lyric data-testid="lyric">{lyric}</Lyric>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayBlock;
