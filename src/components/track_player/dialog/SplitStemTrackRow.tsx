import { Button, Divider, Grid, Theme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { withStyles } from "@mui/styles";
import React from "react";
import { SplitStemTrack } from "../../../common/ChordModel/tracks/SplitStemRequest";
import LabelField from "./LabelField";
import URLField from "./URLField";

interface SplitStemTrackRowProps {
    track: SplitStemTrack;
    onChange: (newTrack: SplitStemTrack) => void;
    onRemove: () => void;
}

const RowContainer = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(Grid);

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
