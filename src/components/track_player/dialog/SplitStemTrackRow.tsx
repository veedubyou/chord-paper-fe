import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid, styled } from "@mui/material";
import { SplitStemTrack } from "common/ChordModel/tracks/SplitStemRequest";
import LabelField from "components/track_player/dialog/LabelField";
import URLField from "components/track_player/dialog/URLField";
import React from "react";

interface SplitStemTrackRowProps {
    track: SplitStemTrack;
    onChange: (newTrack: SplitStemTrack) => void;
    onRemove: () => void;
}

const RowContainer = styled(Grid)(({ theme }) => ({
    margin: theme.spacing(2),
}));

const SplitStemTrackRow: React.FC<SplitStemTrackRowProps> = (
    props: SplitStemTrackRowProps
): JSX.Element => {
    const handleLabelChange = (newLabel: string) => {
        const updatedTrack = props.track.set("label", newLabel);
        props.onChange(updatedTrack);
    };

    const handleURLChange = (newURL: string) => {
        const updatedTrack = props.track.set("original_url", newURL);
        props.onChange(updatedTrack);
    };

    const currentlyProcessing = props.track.id !== "";

    const urlLabelText: string = (() => {
        if (currentlyProcessing) {
            return "Processing track...";
        }

        switch (props.track.track_type) {
            case "split_2stems": {
                return "Track URL to be split into 2 stems";
            }

            case "split_4stems": {
                return "Track URL to be split into 4 stems";
            }

            case "split_5stems": {
                return "Track URL to be split into 5 stems";
            }
        }
    })();

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
                        labelText={urlLabelText}
                        value={props.track.original_url}
                        onChange={handleURLChange}
                        disabled={currentlyProcessing}
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

export default SplitStemTrackRow;
