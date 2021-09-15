import { Box, LinearProgress, Theme, Typography } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { SplitStemTrack } from "../../common/ChordModel/tracks/SplitStemRequest";

const PaddedBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        backgroundColor: grey[100],
    },
}))(Box);

interface LoadingTrackViewProps {
    track: SplitStemTrack;
}

const LoadingTrackView: React.FC<LoadingTrackViewProps> = (
    props: LoadingTrackViewProps
): JSX.Element => {
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
                {props.track.job_status_message}. Refresh to check progress.
            </Typography>
            <LinearProgress
                variant="determinate"
                value={props.track.job_progress}
            />
        </PaddedBox>
    );
};

export default LoadingTrackView;
