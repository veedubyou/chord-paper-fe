import {
    Box,
    Button as UnstyledButton,
    Grid,
    Slider,
    styled,
    Typography,
} from "@mui/material";
import {
    blueGrey,
    grey,
    lightBlue,
    lightGreen,
    pink,
    purple,
    yellow,
} from "@mui/material/colors";
import React from "react";

const FullSizedBox = styled(Box)(({ theme }) => ({
    width: "100%",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
}));

const VolumeSlider = styled(Slider)({
    color: blueGrey[400],
});

const coloredButton = (color: string) => {
    return styled(UnstyledButton)(({ theme }) => ({
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
    }));
};

const DisabledButton = coloredButton(grey[300]);

const ColouredButtons = {
    white: coloredButton("white"),
    pink: coloredButton(pink[200]),
    yellow: coloredButton(yellow[200]),
    purple: coloredButton(purple[100]),
    lightBlue: coloredButton(lightBlue[200]),
    lightGreen: coloredButton(lightGreen[100]),
};

export type ControlPaneButtonColour = keyof typeof ColouredButtons;

export interface StemControl<StemKey extends string> {
    label: StemKey;
    buttonColour: ControlPaneButtonColour;

    enabled: boolean;
    onEnabledChanged: (newEnabled: boolean) => void;
    volume: number;
    onVolumeChanged: (newVolume: number) => void;
}

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
            ? ColouredButtons[stemButton.buttonColour]
            : DisabledButton;

        const handleClick = () => {
            stemButton.onEnabledChanged(!stemButton.enabled);
        };

        const preventClickBubble = (event: React.ChangeEvent<{}>) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const handleVolumeChange = (
            _event: Event,
            value: number | number[]
        ) => {
            if (typeof value !== "number") {
                return;
            }

            stemButton.onVolumeChanged(value);
        };

        return (
            <Grid key={stemButton.label} item xs>
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
                                max={200}
                                step={10}
                                size="small"
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </FullSizedBox>
                </RenderedButton>
            </Grid>
        );
    };

    const buttons = props.stemControls.map(makeButton);

    return <Grid container>{buttons}</Grid>;
};

export default StemTrackControlPane;
