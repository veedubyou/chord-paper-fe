import {
    Theme,
    useTheme,
    FilledInput as UnstyledFilledInput,
    InputBaseComponentProps,
} from "@material-ui/core";
import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import { DataTestID } from "../common/DataTestID";

const FilledInput = withStyles((theme: Theme) => ({
    root: {
        fontSize: theme.typography.h5.fontSize,
    },
}))(UnstyledFilledInput);

const browserInputProps = (theme: Theme, width?: string) => {
    let padding: string | number = 0;
    if (theme?.typography?.h5?.padding) {
        padding = theme.typography.h5.padding;
    }

    const inputProps: InputBaseComponentProps = {
        style: {
            padding: padding,
        },
    };

    if (width && inputProps.style) {
        inputProps.style.width = width;
    }

    return inputProps;
};

interface EditableLineProps extends DataTestID {
    children: string;
    onFinish?: (newValue: string) => void;
    width?: string;
}

const EditableLine: React.FC<EditableLineProps> = (
    props: EditableLineProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.children);
    const theme = useTheme();

    const updateValue = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setValue(event.target.value);
    };

    const forwardEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            finish();
        }
    };

    const finish = () => {
        if (props.onFinish) {
            props.onFinish(value);
        }
    };

    return (
        <FilledInput
            autoFocus
            inputProps={{
                "data-testid": "InnerInput",
                ...browserInputProps(theme, props.width),
            }}
            defaultValue={props.children}
            onBlur={finish}
            onChange={updateValue}
            onKeyPress={forwardEnter}
            fullWidth
            data-testid={props["data-testid"]}
        />
    );
};

export default EditableLine;
