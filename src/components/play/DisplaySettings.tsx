import {
    Box as UnstyledBox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    TextFieldProps as TextFieldPropsWithVariant,
    Theme,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import React, { ChangeEvent, useState } from "react";
import { isWhitespace } from "../../common/Whitespace";
import { PlayFormatting } from "./PlayContent";

type TextFieldProps = Omit<Partial<TextFieldPropsWithVariant>, "variant">;

interface TextSettings {
    numberOfColumns: string;
    fontSize: string;
    columnMargin: string;
}

interface InputFieldSpecification {
    label: string;
    field: keyof TextSettings;
    adornment: string | null;
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

    const settingChangeHandler = (field: keyof TextSettings) => {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            const newSettings: TextSettings = { ...settings };
            newSettings[field] = newValue;
            setSettings(newSettings);
        };
    };

    const intValidationErrorProps = (strValue: string): TextFieldProps => {
        const result = validateInt(strValue);
        return {
            error: isLeft(result) ? true : undefined,
            helperText: isLeft(result) ? result.left.message : undefined,
        };
    };

    const inputSpecs: InputFieldSpecification[] = [
        {
            label: "number of columns",
            field: "numberOfColumns",
            adornment: null,
        },
        {
            label: "font size",
            field: "fontSize",
            adornment: "px",
        },
        {
            label: "column margin",
            field: "columnMargin",
            adornment: "px",
        },
    ];

    const makeInput = (spec: InputFieldSpecification) => {
        const textFieldProps: TextFieldProps = {
            label: spec.label,
            defaultValue: settings[spec.field],
            onChange: settingChangeHandler(spec.field),
            ...intValidationErrorProps(settings[spec.field]),
        };

        if (spec.adornment !== null) {
            textFieldProps.InputProps = {
                endAdornment: (
                    <InputAdornment position="end">
                        {spec.adornment}
                    </InputAdornment>
                ),
            };
        }

        return (
            <Box>
                <TextField {...textFieldProps} />
            </Box>
        );
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Display Settings</DialogTitle>
            <DialogContent>
                {inputSpecs.map((spec: InputFieldSpecification) =>
                    makeInput(spec)
                )}
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
