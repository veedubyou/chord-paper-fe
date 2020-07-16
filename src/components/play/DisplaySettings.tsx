import {
    BaseTextFieldProps,
    Box as UnstyledBox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    Theme,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import React, { ChangeEvent, useState } from "react";
import { isWhitespace } from "../../common/Whitespace";
import { PlayFormatting } from "./PlayContent";

interface TextSettings {
    numberOfColumns: string;
    fontSize: string;
    columnMargin: string;
}

interface DisplaySettingsProps {
    open: boolean;
    onClose?: () => void;
    defaultSettings: PlayFormatting;
    onSubmit?: (formatting: PlayFormatting) => void;
}

const Box = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(1),
    },
}))(UnstyledBox);

const DisplaySettings: React.FC<DisplaySettingsProps> = (
    props: DisplaySettingsProps
): JSX.Element => {
    const [settings, setSettings] = useState<TextSettings>({
        numberOfColumns: props.defaultSettings.numberOfColumns.toString(),
        fontSize: props.defaultSettings.fontSize.toString(),
        columnMargin: props.defaultSettings.columnMargin.toString(),
    });

    const validateInt = (strValue: string): Either<Error, number> => {
        if (strValue === "" || isWhitespace(strValue)) {
            return left(new Error("A value is required"));
        }

        const convertedNumber = Number(strValue);
        if (isNaN(convertedNumber)) {
            return left(new Error("Only numbers are allowed"));
        }

        if (convertedNumber <= 0) {
            return left(new Error("Only positive numbers are allowed"));
        }

        const convertedInteger = Math.floor(convertedNumber);
        if (convertedNumber !== convertedInteger) {
            return left(new Error("Only integers are allowed"));
        }

        return right(convertedInteger);
    };

    const validatedSettings = (): Either<Error, PlayFormatting> => {
        const numberOfColumnsResults = validateInt(settings.numberOfColumns);
        const fontSizeResults = validateInt(settings.fontSize);
        const columnMarginResults = validateInt(settings.columnMargin);

        if (isLeft(numberOfColumnsResults)) {
            return numberOfColumnsResults;
        }

        if (isLeft(fontSizeResults)) {
            return fontSizeResults;
        }

        if (isLeft(columnMarginResults)) {
            return columnMarginResults;
        }

        const formatting: PlayFormatting = {
            numberOfColumns: numberOfColumnsResults.right,
            fontSize: fontSizeResults.right,
            columnMargin: columnMarginResults.right,
        };

        return right(formatting);
    };

    const hasValidationErrors = (): boolean => {
        return isLeft(validatedSettings());
    };

    const handleSubmit = () => {
        const settings = validatedSettings();

        if (isLeft(settings)) {
            return;
        }

        props.onSubmit?.({
            numberOfColumns: settings.right.numberOfColumns,
            fontSize: settings.right.fontSize,
            columnMargin: settings.right.columnMargin,
        });
    };

    const handleColumnsChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newValue = event.target.value;
        setSettings({
            ...settings,
            numberOfColumns: newValue,
        });
    };

    const handleFontsizeChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newValue = event.target.value;
        setSettings({
            ...settings,
            fontSize: newValue,
        });
    };

    const handleColumnMarginChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newValue = event.target.value;
        setSettings({
            ...settings,
            columnMargin: newValue,
        });
    };

    const intValidationErrorProps = (
        strValue: string
    ): Omit<Partial<BaseTextFieldProps>, "variant"> => {
        const result = validateInt(strValue);
        return {
            error: isLeft(result) ? true : undefined,
            helperText: isLeft(result) ? result.left.message : undefined,
        };
    };

    const numberOfColumnsInput = () => {
        return (
            <Box>
                <TextField
                    defaultValue={settings.numberOfColumns}
                    label="number of columns"
                    onChange={handleColumnsChange}
                    {...intValidationErrorProps(settings.numberOfColumns)}
                />
            </Box>
        );
    };

    const fontSizeInput = () => {
        return (
            <Box>
                <TextField
                    label="font size"
                    defaultValue={settings.fontSize}
                    onChange={handleFontsizeChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    {...intValidationErrorProps(settings.fontSize)}
                />
            </Box>
        );
    };

    const columnMarginInput = () => {
        return (
            <Box>
                <TextField
                    label="column margin"
                    defaultValue={settings.columnMargin}
                    onChange={handleColumnMarginChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    {...intValidationErrorProps(settings.columnMargin)}
                />
            </Box>
        );
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Display Settings</DialogTitle>
            <DialogContent>
                {numberOfColumnsInput()}
                {fontSizeInput()}
                {columnMarginInput()}
            </DialogContent>

            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={hasValidationErrors()} onClick={handleSubmit}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DisplaySettings;
