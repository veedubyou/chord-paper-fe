import { Button, Divider, Grid, Theme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { withStyles } from "@mui/styles";
import React from "react";
import { SingleTrack } from "../../../common/ChordModel/tracks/SingleTrack";
import LabelField from "./LabelField";
import URLField from "./URLField";

interface SingleTrackRowProps {
    track: SingleTrack;
    onChange: (newTrack: SingleTrack) => void;
    onRemove: () => void;
}

const RowContainer = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(Grid);

const SingleTrackRow: React.FC<SingleTrackRowProps> = (
    props: SingleTrackRowProps
): JSX.Element => {
    const handleLabelChange = (newLabel: string) => {
        const updatedTrack = props.track.set("label", newLabel);
        props.onChange(updatedTrack);
    };

    const handleURLChange = (newURL: string) => {
        const updatedTrack = props.track.set("url", newURL);
        props.onChange(updatedTrack);
    };

    return (
        <>
            <RowContainer container alignItems="center">
                <Grid xs={5} item>
                    <LabelField
                        value={props.track.label}
                        onChange={handleLabelChange}
                    />
                </Grid>
                <Grid xs={5} item>
                    <URLField
                        labelText="Track URL"
                        value={props.track.url}
                        onChange={handleURLChange}
                    />
                </Grid>
                <Grid xs={2} item>
                    <Button onClick={props.onRemove}>
                        <DeleteIcon />
                    </Button>
                </Grid>
            </RowContainer>

            <Divider />
        </>
    );
};

export default SingleTrackRow;
