import DeleteIcon from "@mui/icons-material/Delete";
import {
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
} from "@mui/material";
import {
    SplitEngineTypes,
    SplitStemTrack,
    SplitStemTypes,
} from "common/ChordModel/tracks/SplitStemRequest";
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
    const handleEngineChange = (changeEvent: SelectChangeEvent<unknown>) => {
        const updatedTrack = props.track.setEngineType(
            changeEvent.target.value as SplitEngineTypes
        );
        props.onChange(updatedTrack);
    };

    const handleStemCountChange = (changeEvent: SelectChangeEvent<unknown>) => {
        const updatedTrack = props.track.setTrackType(
            changeEvent.target.value as SplitStemTypes
        );
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

    const stemCountMenuItems = (() => {
        switch (props.track.engine_type) {
            case "spleeter": {
                return [
                    <MenuItem value={"split_2stems"}>2</MenuItem>,
                    <MenuItem value={"split_4stems"}>4</MenuItem>,
                    <MenuItem value={"split_5stems"}>5</MenuItem>,
                ];
            }

            case "demucs": {
                return [
                    <MenuItem value={"split_2stems"}>2</MenuItem>,
                    <MenuItem value={"split_4stems"}>4</MenuItem>,
                ];
            }
        }
    })();

    return (
        <>
            <RowContainer container alignItems="center">
                <Grid xs={3} item>
                    <FormControl>
                        <InputLabel id="splitting-engine-label">
                            Engine
                        </InputLabel>
                        <Select
                            labelId="splitting-engine-label"
                            label="Engine"
                            value={props.track.engine_type}
                            onChange={handleEngineChange}
                        >
                            <MenuItem value={"spleeter"}>Spleeter</MenuItem>
                            <MenuItem value={"demucs"}>Demucs</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={2} item>
                    <FormControl>
                        <InputLabel id="stem-count-label">
                            Stem Count
                        </InputLabel>
                        <Select
                            labelId="stem-count-label"
                            label="Stem Count"
                            value={props.track.track_type}
                            onChange={handleStemCountChange}
                        >
                            {stemCountMenuItems}
                        </Select>
                    </FormControl>
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
