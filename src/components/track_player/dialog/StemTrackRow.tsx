import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Divider, Grid, styled } from "@mui/material";
import { StemTrack } from "common/ChordModel/tracks/StemTrack";
import { mapObject } from "common/mapObject";
import LabelField from "components/track_player/dialog/LabelField";
import URLField from "components/track_player/dialog/URLField";
import lodash from "lodash";
import React from "react";

export type URLFieldLabel<StemKey extends string> = {
    key: StemKey;
    label: string;
};

interface StemTrackRowProps<
    StemKey extends string,
    T extends StemTrack<StemKey>
> {
    track: T;
    urlFieldLabels: URLFieldLabel<StemKey>[];
    onChange: (newTrack: T) => void;
    onRemove: () => void;
}

const RowContainer = styled(Grid)(({ theme }) => ({
    margin: theme.spacing(2),
}));

const StemTrackRow = <StemKey extends string, T extends StemTrack<StemKey>>(
    props: StemTrackRowProps<StemKey, T>
): JSX.Element => {
    const handleLabelChange = (newLabel: string) => {
        const updatedTrack = props.track.setLabel(newLabel);
        props.onChange(updatedTrack);
    };

    const makeURLField = (
        url: string,
        stemKey: StemKey
    ): React.ReactElement => {
        const handleChange = (newURL: string) => {
            const updatedTrack = lodash.clone(props.track);
            updatedTrack.stem_urls[stemKey] = newURL;
            props.onChange(updatedTrack);
        };

        const label = (() => {
            const fieldLabel = props.urlFieldLabels.find(
                (value: URLFieldLabel<StemKey>) => value.key === stemKey
            );
            if (fieldLabel === undefined) {
                return "File URL";
            }

            return fieldLabel.label;
        })();

        return (
            <URLField labelText={label} value={url} onChange={handleChange} />
        );
    };

    const stemURLFields = mapObject(props.track.stem_urls, makeURLField);

    const createFirstRow = (stemKey: StemKey) => {
        return (
            <RowContainer key={stemKey} container alignItems="center">
                <Grid xs={5} item>
                    <LabelField
                        value={props.track.label}
                        onChange={handleLabelChange}
                    />
                </Grid>
                <Grid xs={5} item>
                    {stemURLFields[stemKey]}
                </Grid>
                <Grid xs={2} item>
                    <Button onClick={props.onRemove}>
                        <DeleteIcon />
                    </Button>
                </Grid>
            </RowContainer>
        );
    };

    const createSubsequentRows = (stemKey: StemKey) => {
        return (
            <RowContainer key={stemKey} container alignItems="center">
                <Grid xs={5} item></Grid>
                <Grid xs={5} item>
                    {stemURLFields[stemKey]}
                </Grid>
                <Grid xs={2} item></Grid>
            </RowContainer>
        );
    };

    const rows = props.urlFieldLabels.map(
        (fieldLabel: URLFieldLabel<StemKey>, index: number) => {
            if (index === 0) {
                return createFirstRow(fieldLabel.key);
            }

            return createSubsequentRows(fieldLabel.key);
        }
    );

    return (
        <>
            {rows}
            <Divider />
        </>
    );
};

export default StemTrackRow;
