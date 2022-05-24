import {
    Box as UnstyledBox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel as UnstyledFormLabel,
    InputAdornment,
    Radio,
    RadioGroup, styled, TextField,
    TextFieldProps as TextFieldPropsWithVariant, Typography
} from "@mui/material";
import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import React, { ChangeEvent, useState } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { isWhitespace } from "../../../common/Whitespace";
import { PageDisplaySettings } from "./PagePlayContent";

const Box = styled(UnstyledBox)(({ theme }) => ({
    margin: theme.spacing(1),
}));

const FormLabel = styled(UnstyledFormLabel)(({ theme }) => ({
    fontSize: "0.75rem",
}));

const RadioLabelTypography = styled(Typography)(({ theme }) => ({
    fontSize: "0.75rem",
}));

type TextFieldProps = Omit<Partial<TextFieldPropsWithVariant>, "variant">;

interface DialogInput {
    numberOfColumns: string;
    fontSize: string;
    columnMargin: string;
    flipType: PageDisplaySettings["flipType"];
}

type TextInputFieldKeys = keyof Omit<DialogInput, "flipType">;

interface InputFieldSpecification {
    label: string;
    field: TextInputFieldKeys;
    adornment: string | null;
    validationErrorPropsFn: (strValue: string) => Either<Error, number>;
}

interface DisplaySettingsDialogProps {
    open: boolean;
    onClose?: PlainFn;
    defaultSettings: PageDisplaySettings;
    onSubmit?: (displaySettings: PageDisplaySettings) => void;
}

const DisplaySettingsDialog: React.FC<DisplaySettingsDialogProps> = (
    props: DisplaySettingsDialogProps
): JSX.Element => {
    const [settings, setSettings] = useState<DialogInput>({
        numberOfColumns:
            props.defaultSettings.numberOfColumnsPerPage.toString(),
        fontSize: props.defaultSettings.fontSize.toString(),
        columnMargin: props.defaultSettings.columnMargin.toString(),
        flipType: props.defaultSettings.flipType,
    });

    const validateNumber = (strValue: string): Either<Error, number> => {
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

        return right(convertedNumber);
    };

    const validateInt = (strValue: string): Either<Error, number> => {
        const result = validateNumber(strValue);

        if (isLeft(result)) {
            return result;
        }

        const convertedNumber = result.right;

        const convertedInteger = Math.floor(convertedNumber);
        if (convertedNumber !== convertedInteger) {
            return left(new Error("Only integers are allowed"));
        }

        return right(convertedInteger);
    };

    const validatedSettings = (): Either<Error, PageDisplaySettings> => {
        const numberOfColumnsResults = validateInt(settings.numberOfColumns);
        const fontSizeResults = validateNumber(settings.fontSize);
        const columnMarginResults = validateNumber(settings.columnMargin);

        if (isLeft(numberOfColumnsResults)) {
            return numberOfColumnsResults;
        }

        if (isLeft(fontSizeResults)) {
            return fontSizeResults;
        }

        if (isLeft(columnMarginResults)) {
            return columnMarginResults;
        }

        const displaySettings: PageDisplaySettings = {
            numberOfColumnsPerPage: numberOfColumnsResults.right,
            fontSize: fontSizeResults.right,
            columnMargin: columnMarginResults.right,
            flipType: settings.flipType,
        };

        return right(displaySettings);
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
            numberOfColumnsPerPage: settings.right.numberOfColumnsPerPage,
            fontSize: settings.right.fontSize,
            columnMargin: settings.right.columnMargin,
            flipType: settings.right.flipType,
        });
    };

    const textSettingChangeHandler = (field: TextInputFieldKeys) => {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = event.target.value;
            const newSettings: DialogInput = { ...settings };
            newSettings[field] = newValue;
            setSettings(newSettings);
        };
    };

    const validationErrorProps = (
        result: Either<Error, number>
    ): TextFieldProps => {
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
            validationErrorPropsFn: (val: string) => validateInt(val),
        },
        {
            label: "font size",
            field: "fontSize",
            adornment: "px",
            validationErrorPropsFn: (val: string) => validateNumber(val),
        },
        {
            label: "column margin",
            field: "columnMargin",
            adornment: "px",
            validationErrorPropsFn: (val: string) => validateNumber(val),
        },
    ];

    const makeInput = (spec: InputFieldSpecification) => {
        const textFieldProps: TextFieldProps = {
            label: spec.label,
            defaultValue: settings[spec.field],
            onChange: textSettingChangeHandler(spec.field),
            ...validationErrorProps(
                spec.validationErrorPropsFn(settings[spec.field])
            ),
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

    const flipTypeToggle = (() => {
        const handleFlipTypeChange = (
            _event: React.ChangeEvent<HTMLInputElement>,
            value: string
        ) => {
            if (value !== "page" && value !== "column") {
                console.error(
                    "Display dialog - flip type: Received an invalid radio value"
                );
                return;
            }

            setSettings({
                ...settings,
                flipType: value,
            });
        };

        return (
            <Box>
                <FormControl component="fieldset">
                    <FormLabel>flip type</FormLabel>
                    <RadioGroup
                        value={settings.flipType}
                        onChange={handleFlipTypeChange}
                    >
                        <FormControlLabel
                            value="column"
                            control={<Radio size="small" />}
                            label={
                                <RadioLabelTypography>
                                    flip column
                                </RadioLabelTypography>
                            }
                        />
                        <FormControlLabel
                            value="page"
                            control={<Radio size="small" />}
                            label={
                                <RadioLabelTypography>
                                    flip page
                                </RadioLabelTypography>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        );
    })();

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Display Settings</DialogTitle>
            <DialogContent>
                {flipTypeToggle}

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

export default DisplaySettingsDialog;
