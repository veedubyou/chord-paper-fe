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
                    value={40} //TODO: placeholder until we get real progress values
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
            <LinearProgress />
        </PaddedBox>
    );
};

export default LoadingTrackView;
