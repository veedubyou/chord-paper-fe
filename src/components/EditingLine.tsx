import {
    Theme,
    useTheme,
    FilledInput as UnstyledFilledInput,
} from "@material-ui/core";
import React from "react";
import { withStyles } from "@material-ui/styles";

const FilledInput = withStyles((theme: Theme) => ({
    root: {
        fontSize: theme.typography.h5.fontSize,
    },
}))(UnstyledFilledInput);

const browserInputProps = (theme: Theme) => {
    let padding: string | number = 0;
    if (theme?.typography?.h5?.padding) {
        padding = theme.typography.h5.padding;
    }

    return {
        style: {
            padding: padding,
        },
    };
};

interface EditingLineProps {
    text: string;
    onChange?: (newValue: string) => void;
    onFinish?: () => void;
}

const EditingLine: React.FC<EditingLineProps> = (
    props: EditingLineProps
): JSX.Element => {
    const theme = useTheme();
    const forwardChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (props.onChange && event?.target?.value) {
            props.onChange(event.target.value);
        }
    };

    const forwardEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (props.onFinish && event.key === "Enter") {
            props.onFinish();
        }
    };

    return (
        <FilledInput
            autoFocus
            inputProps={browserInputProps(theme)}
            value={props.text}
            // onBlur={props.onFinish}
            onChange={forwardChange}
            onKeyPress={forwardEnter}
            fullWidth
        />
    );
};

export default EditingLine;
