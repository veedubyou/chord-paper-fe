import {
    Box,
    Button as UnstyledButton,
    Grid,
    Slider,
    Theme,
    Typography,
} from "@material-ui/core";
import {
    blueGrey,
    grey,
    lightBlue,
    pink,
    purple,
    yellow,
} from "@material-ui/core/colors";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { FourStemKeys } from "../../../../common/ChordModel/Track";

const FullSizedBox = withStyles((theme: Theme) => ({
    root: {
        width: "100%",
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
    },
}))(Box);

const VolumeSlider = withStyles({
    root: {
        color: blueGrey[400],
    },
})(Slider);

const withColoredButtonStyle = (color: string) => {
    return withStyles((theme: Theme) => ({
        root: {
            backgroundColor: color,
            width: "100%",
            height: "100%",
            color: grey[700],
            padding: theme.spacing(0.5),
            textTransform: "none",
            "&:hover": {
                opacity: 0.6,
                backgroundColor: color,
            },
        },
    }));
};

const DisabledButton = withColoredButtonStyle(grey[300])(UnstyledButton);

export interface StemControl<StemKey extends string> {
    label: StemKey;
    buttonColour: string;

    enabled: boolean;
    onEnabledChanged: (newEnabled: boolean) => void;
    volume: number;
    onVolumeChanged: (newVolume: number) => void;
}

interface StemProperty {
    label: string;
    button: typeof DisabledButton; // somehow typeof Button doesn't match - just using an arbitrary one since they are all the same type
}

const buttonSpecs: Record<FourStemKeys, StemProperty> = {
    bass: {
        label: "Bass",
        button: withColoredButtonStyle(pink[200])(UnstyledButton),
    },
    drums: {
        label: "Drums",
        button: withColoredButtonStyle(yellow[200])(UnstyledButton),
    },
    other: {
        label: "Other",
        button: withColoredButtonStyle(purple[100])(UnstyledButton),
    },
    vocals: {
        label: "Vocal",
        button: withColoredButtonStyle(lightBlue[200])(UnstyledButton),
    },
};

// T is a stem key, e.g. "bass" | "drums"
type StemTrackControlPaneProps<StemKey extends string> = {
    stemControls: StemControl<StemKey>[];
};

const StemTrackControlPane = <StemKey extends string>(
    props: StemTrackControlPaneProps<StemKey>
): JSX.Element => {
    const makeButton = <StemKey extends string>(
        stemButton: StemControl<StemKey>
    ) => {
        const RenderedButton = stemButton.enabled
            ? withColoredButtonStyle(stemButton.buttonColour)(UnstyledButton) //TODO: can perform better? TBD
            : DisabledButton;

        const handleClick = () => {
            stemButton.onEnabledChanged(!stemButton.enabled);
        };

        const preventClickBubble = (event: React.ChangeEvent<{}>) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const handleVolumeChange = (
            _event: React.ChangeEvent<{}>,
            value: number | number[]
        ) => {
            if (typeof value !== "number") {
                return;
            }

            stemButton.onVolumeChanged(value);
        };

        return (
            <Grid item>
                <RenderedButton variant="contained" onClick={handleClick}>
                    <FullSizedBox>
                        <Typography variant="body1">
                            {stemButton.label}
                        </Typography>

                        <Box onClick={preventClickBubble}>
                            <VolumeSlider
                                value={stemButton.volume}
                                onChange={handleVolumeChange}
                                min={0}
                                max={150}
                                step={10}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </FullSizedBox>
                </RenderedButton>
            </Grid>
        );
    };

    const buttons = props.stemButtons.map(makeButton);

    return <Grid container>{buttons}</Grid>;
};

export default StemTrackControlPane;
