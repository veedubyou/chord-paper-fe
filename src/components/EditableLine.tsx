import {
    Theme,
    useTheme,
    FilledInput as UnstyledFilledInput,
} from "@material-ui/core";
import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import { DataTestID } from "../common/DataTestID";

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

interface EditableLineProps extends DataTestID {
    children: string;
    onFinish?: (newValue: string) => void;
}

const EditableLine: React.FC<EditableLineProps> = (
    props: EditableLineProps
): JSX.Element => {
    const [value, setValue] = useState<string>(props.children);
    const theme = useTheme();

    const updateValue = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (!event?.target?.value) {
            console.error("No target value from FilledInput component");
            return;
        }

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

    const innerTestID = (): string | undefined => {
        if (!props["data-testid"]) {
            return undefined;
        }

        return `${props["data-testid"]}-Inner`;
    };

    return (
        <FilledInput
            autoFocus
            inputProps={{
                "data-testid": innerTestID(),
                ...browserInputProps(theme),
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
