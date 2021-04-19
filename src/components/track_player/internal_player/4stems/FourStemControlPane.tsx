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
import { mapObject } from "../../../../common/mapObject";

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

export interface StemControl {
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

type FourStemControlPaneProps = Record<FourStemKeys, StemControl>;

const FourStemControlPane: React.FC<FourStemControlPaneProps> = (
    props: FourStemControlPaneProps
): JSX.Element => {
    const makeButton = (stem: StemProperty, stemKey: FourStemKeys) => {
        const StemButton = props[stemKey].enabled
            ? stem.button
            : DisabledButton;

        const handleClick = () => {
            props[stemKey].onEnabledChanged(!props[stemKey].enabled);
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

            props[stemKey].onVolumeChanged(value);
        };

        return (
            <Grid xs={3} item>
                <StemButton variant="contained" onClick={handleClick}>
                    <FullSizedBox>
                        <Typography variant="body1">{stem.label}</Typography>

                        <Box onClick={preventClickBubble}>
                            <VolumeSlider
                                value={props[stemKey].volume}
                                onChange={handleVolumeChange}
                                min={0}
                                max={150}
                                step={10}
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </FullSizedBox>
                </StemButton>
            </Grid>
        );
    };

    const buttons = mapObject(buttonSpecs, makeButton);

    return (
        <Grid container>
            {buttons.vocals}
            {buttons.other}
            {buttons.bass}
            {buttons.drums}
        </Grid>
    );
};

export default FourStemControlPane;
