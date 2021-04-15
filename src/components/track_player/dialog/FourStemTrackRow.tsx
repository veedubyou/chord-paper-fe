import { Button, Divider, Grid, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/styles";
import lodash from "lodash";
import React from "react";
import { FourStemsTrack } from "../../../common/ChordModel/Track";
import LabelField from "./LabelField";
import URLField from "./URLField";

interface FourStemTrackRowProps {
    track: FourStemsTrack;
    onChange: (newTrack: FourStemsTrack) => void;
    onRemove: () => void;
}

const RowContainer = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(Grid);

const FourStemTrackRow: React.FC<FourStemTrackRowProps> = (
    props: FourStemTrackRowProps
): JSX.Element => {
    const handleLabelChange = (newLabel: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.label = newLabel;
        props.onChange(updatedTrack);
    };

    const handleBassURLChange = (newURL: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.stems.bass_url = newURL;
        props.onChange(updatedTrack);
    };

    const handleDrumsURLChange = (newURL: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.stems.drums_url = newURL;
        props.onChange(updatedTrack);
    };

    const handleOtherURLChange = (newURL: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.stems.other_url = newURL;
        props.onChange(updatedTrack);
    };

    const handleVocalsURLChange = (newURL: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.stems.vocals_url = newURL;
        props.onChange(updatedTrack);
    };

    return (
        <>
            <RowContainer key="vocals" container alignItems="center">
                <Grid xs={5} item>
                    <LabelField
                        value={props.track.label}
                        onChange={handleLabelChange}
                    />
                </Grid>
                <Grid xs={5} item>
                    <URLField
                        labelText="Vocals URL"
                        value={props.track.stems.vocals_url}
                        onChange={handleVocalsURLChange}
                    />
                </Grid>
                <Grid xs={2} item>
                    <Button onClick={props.onRemove}>
                        <DeleteIcon />
                    </Button>
                </Grid>
            </RowContainer>
            <RowContainer key="other" container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    <URLField
                        labelText="Other URL"
                        value={props.track.stems.other_url}
                        onChange={handleOtherURLChange}
                    />
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>

            <RowContainer key="bass" container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    <URLField
                        labelText="Bass URL"
                        value={props.track.stems.bass_url}
                        onChange={handleBassURLChange}
                    />
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>

            <RowContainer key="drums" container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    <URLField
                        labelText="Drums URL"
                        value={props.track.stems.drums_url}
                        onChange={handleDrumsURLChange}
                    />
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>

            <Divider />
        </>
    );
};

export default FourStemTrackRow;
