import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid, styled } from "@mui/material";
import { SingleTrack } from "common/ChordModel/tracks/SingleTrack";
import LabelField from "components/track_player/dialog/LabelField";
import URLField from "components/track_player/dialog/URLField";
import React from "react";

interface SingleTrackRowProps {
    track: SingleTrack;
    onChange: (newTrack: SingleTrack) => void;
    onRemove: () => void;
}

const RowContainer = styled(Grid)(({ theme }) => ({
    margin: theme.spacing(2),
}));

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
