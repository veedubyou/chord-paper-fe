import {
    Button as UnstyledButton,
    Grid,
    Theme,
    Typography,
} from "@material-ui/core";
import {
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

export interface ButtonStateAndAction {
    enabled: boolean;
    onToggle: (newState: boolean) => void;
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

type FourStemControlPaneProps = Record<FourStemKeys, ButtonStateAndAction>;

const FourStemControlPane: React.FC<FourStemControlPaneProps> = (
    props: FourStemControlPaneProps
): JSX.Element => {
    const makeButton = (stem: StemProperty, stemKey: FourStemKeys) => {
        const StemButton = props[stemKey].enabled
            ? stem.button
            : DisabledButton;

        const handleClick = () => {
            props[stemKey].onToggle(!props[stemKey].enabled);
        };

        return (
            <Grid xs={3} item>
                <StemButton variant="contained" onClick={handleClick}>
                    <Typography variant="body1">{stem.label}</Typography>
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
