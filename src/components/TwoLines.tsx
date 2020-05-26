import React from 'react';
import StatefulEditableLine from './StatefulEditableLine'
import { Grid, Typography, Box } from '@material-ui/core';

interface TwoLinesProps {
    // initialText?: string;
}

const TwoLines: React.FC<TwoLinesProps> = (props: TwoLinesProps): JSX.Element => {
    return (
        <Box marginRight="10px">
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Typography>
                        A bunch of stuff
                    </Typography>
                </Grid>
                <Grid item>
                    <StatefulEditableLine initialText="dahiho"/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default TwoLines;