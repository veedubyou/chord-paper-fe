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

const VocalsButton = withColoredButtonStyle(lightBlue[200])(UnstyledButton);
const OtherButton = withColoredButtonStyle(purple[100])(UnstyledButton);
const BassButton = withColoredButtonStyle(pink[200])(UnstyledButton);
const DrumsButton = withColoredButtonStyle(yellow[200])(UnstyledButton);
const DisabledButton = withColoredButtonStyle(grey[300])(UnstyledButton);

export interface ButtonStateAndAction {
    enabled: boolean;
    onToggle: (newState: boolean) => void;
}

interface FourStemControlPaneProps {
    bass: ButtonStateAndAction;
    drums: ButtonStateAndAction;
    other: ButtonStateAndAction;
    vocals: ButtonStateAndAction;
}

interface StemProperty {
    label: string;
    button: typeof VocalsButton; // somehow typeof Button doesn't match - just using an arbitrary one since they are all the same type
    buttonStateAndAction: ButtonStateAndAction;
}

const FourStemControlPane: React.FC<FourStemControlPaneProps> = (
    props: FourStemControlPaneProps
): JSX.Element => {
    const stemProperties: StemProperty[] = [
        {
            label: "Vocals",
            button: VocalsButton,
            buttonStateAndAction: props.vocals,
        },
        {
            label: "Other",
            button: OtherButton,
            buttonStateAndAction: props.other,
        },
        {
            label: "Bass",
            button: BassButton,
            buttonStateAndAction: props.bass,
        },
        {
            label: "Drums",
            button: DrumsButton,
            buttonStateAndAction: props.drums,
        },
    ];

    const makeButton = (stem: StemProperty) => {
        const StemButton = stem.buttonStateAndAction.enabled
            ? stem.button
            : DisabledButton;

        const handleClick = () => {
            stem.buttonStateAndAction.onToggle(
                !stem.buttonStateAndAction.enabled
            );
        };

        return (
            <Grid xs={3} item>
                <StemButton variant="contained" onClick={handleClick}>
                    <Typography variant="body1">{stem.label}</Typography>
                </StemButton>
            </Grid>
        );
    };

    return <Grid container>{stemProperties.map(makeButton)}</Grid>;
};

export default FourStemControlPane;
