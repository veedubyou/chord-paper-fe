import { Box, LinearProgress, Theme, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import React, { useEffect } from "react";
import { SplitStemTrack } from "../../common/ChordModel/tracks/SplitStemRequest";
import { PlainFn } from "../../common/PlainFn";
import { grey } from '@mui/material/colors';

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: grey[100],
    },
}))(Box);

const refreshInterval = 10000;

interface LoadingSplitStemTrackViewProps {
    track: SplitStemTrack;
    refreshTrackFn: PlainFn;
}

const LoadingSplitStemTrackView: React.FC<LoadingSplitStemTrackViewProps> = (
    props: LoadingSplitStemTrackViewProps
): JSX.Element => {
    useEffect(() => {
        if (props.track.job_status === "error") {
            return;
        }

        setTimeout(props.refreshTrackFn, refreshInterval);
    }, [props]);

    if (props.track.job_status === "error") {
        console.error(props.track.job_status_debug_log);

        const message = `An Error Occurred: ${props.track.job_status_message}`;
        return (
            <PaddedBox>
                <Typography variant="body1">{message}</Typography>
                <LinearProgress
                    variant="determinate"
                    value={props.track.job_progress}
                    color="secondary"
                />
            </PaddedBox>
        );
    }

    return (
        <PaddedBox>
            <Typography variant="body1">
                {props.track.job_status_message}
            </Typography>
            <LinearProgress
                variant="determinate"
                value={props.track.job_progress}
            />
        </PaddedBox>
    );
};

export default LoadingSplitStemTrackView;
