import {
    Box as UnstyledBox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
    TextFieldProps as TextFieldPropsWithVariant,
    Theme,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { PlainFn } from "../../common/PlainFn";
import { isValidUrl } from "../../common/URL";

type TextFieldProps = Omit<Partial<TextFieldPropsWithVariant>, "variant">;

export interface PlayerSettings {
    enablePlayer: boolean;
    url: string;
}

interface PlayerSettingsDialogProps {
    open: boolean;
    onClose?: PlainFn;
    defaultSettings: PlayerSettings;
    onSubmit?: (settings: PlayerSettings) => void;
}

const Box = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(1),
    },
}))(UnstyledBox);

const PlayerSettingsDialog: React.FC<PlayerSettingsDialogProps> = (
    props: PlayerSettingsDialogProps
): JSX.Element => {
    const [settings, setSettings] = useState<PlayerSettings>(
        props.defaultSettings
    );

    const hasError = settings.url !== "" && !isValidUrl(settings.url);

    const urlInput: React.ReactElement = (() => {
        const updateURL = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            setSettings({
                ...settings,
                url: event.target.value,
            });
        };

        const textFieldProps: TextFieldProps = {
            label: "Song URL",
            defaultValue: settings.url,
            onChange: updateURL,
            error: hasError ? true : undefined,
            helperText: hasError
                ? "Song URL needs to be a valid URL"
                : undefined,
        };

        return (
            <Box>
                <TextField {...textFieldProps} />
            </Box>
        );
    })();

    const handleEnableToggle = (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ): void => {
        setSettings({
            ...settings,
            enablePlayer: event.target.checked,
        });
    };

    const handleSubmit = () => {
        if (hasError) {
            return;
        }

        props.onSubmit?.(settings);
    };

    const enableSwitch = (
        <Switch
            checked={settings.enablePlayer}
            color="primary"
            onChange={handleEnableToggle}
            name="enablePlayer"
        />
    );

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Player Settings</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    control={enableSwitch}
                    label="Enable Player"
                    labelPlacement="end"
                />
                {urlInput}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={hasError} onClick={handleSubmit}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PlayerSettingsDialog;
