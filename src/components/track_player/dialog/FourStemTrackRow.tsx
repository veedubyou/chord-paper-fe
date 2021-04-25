import { Button, Divider, Grid, Theme } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/styles";
import lodash from "lodash";
import React from "react";
import {
    FourStemKeys,
    FourStemsTrack,
} from "../../../common/ChordModel/tracks/StemTrack";
import { mapObject } from "../../../common/mapObject";
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

const urlFieldLabels: Record<FourStemKeys, string> = {
    bass: "Bass URL",
    drums: "Drums URL",
    other: "Other URL",
    vocals: "Vocals URL",
};

const FourStemTrackRow: React.FC<FourStemTrackRowProps> = (
    props: FourStemTrackRowProps
): JSX.Element => {
    const handleLabelChange = (newLabel: string) => {
        const updatedTrack = lodash.clone(props.track);
        updatedTrack.label = newLabel;
        props.onChange(updatedTrack);
    };

    const makeURLField = (
        label: string,
        stemKey: FourStemKeys
    ): React.ReactElement => {
        const handleChange = (newURL: string) => {
            const updatedTrack = lodash.clone(props.track);
            updatedTrack.stem_urls[stemKey] = newURL;
            props.onChange(updatedTrack);
        };

        return (
            <URLField
                labelText={label}
                value={props.track.stem_urls[stemKey]}
                onChange={handleChange}
            />
        );
    };

    const stemURLFields = mapObject(urlFieldLabels, makeURLField);

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
                    {stemURLFields.vocals}
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
                    {stemURLFields.other}
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>
            <RowContainer key="bass" container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    {stemURLFields.bass}
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>
            <RowContainer key="drums" container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    {stemURLFields.drums}
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>

            <Divider />
        </>
    );
};

export default FourStemTrackRow;
