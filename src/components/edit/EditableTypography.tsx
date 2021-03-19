import { Box, Typography, TypographyProps } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { DataTestID } from "../../common/DataTestID";
import { inflateIfEmpty } from "../../common/Whitespace";
import TextInput from "./TextInput";
import { PlainFn } from "../../common/PlainFn";

export interface EditControl {
    editing: boolean;
    onStartEdit: PlainFn;
    onEndEdit: PlainFn;
}

interface EditableTypographyProps extends DataTestID, TypographyProps {
    children?: never;
    value: string;
    // provide this if you want to provide explicit control over the editability
    // of the field. this means the parent must manage this component's editing state
    editControl?: EditControl;

    onValueChange?: (newValue: string) => void;
    placeholder?: string;
}

const PlaceholderTypography = withStyles({
    root: {
        color: grey[400],
    },
})(Typography);

const EditableTypography: React.FC<EditableTypographyProps> = (
    props: EditableTypographyProps
): JSX.Element => {
    const [editingState, setEditingState] = useState(false);

    const editing: boolean =
        props.editControl !== undefined
            ? props.editControl.editing
            : editingState;

    const startEdit = () => {
        if (props.editControl !== undefined) {
            props.editControl.onStartEdit();
        } else {
            setEditingState(true);
        }
    };

    const finishEdit = (newValue: string) => {
        if (props.editControl !== undefined) {
            props.editControl.onEndEdit();
        } else {
            setEditingState(false);
        }

        if (props.onValueChange) {
            props.onValueChange(newValue);
        }
    };

    const nonEditableLine = (): React.ReactElement => {
        const {
            value,
            placeholder,
            onValueChange,
            editControl,
            ...typographyProps
        } = props;

        if (props.value === "" && props.placeholder !== undefined) {
            return (
                <PlaceholderTypography {...typographyProps} onClick={startEdit}>
                    {props.placeholder}
                </PlaceholderTypography>
            );
        }

        return (
            <Typography {...typographyProps} onClick={startEdit}>
                {inflateIfEmpty(props.children)}
            </Typography>
        );
    };

    const editableLine = (): React.ReactElement => {
        if (props.variant === "inherit" || props.variant === "srOnly") {
            throw new Error("can't have these variant types");
        }

        return (
            <TextInput
                variant={props.variant}
                onFinish={finishEdit}
                data-testid={"EditableLine"}
            >
                {props.children}
            </TextInput>
        );
    };

    const elem: React.ReactElement = editing
        ? editableLine()
        : nonEditableLine();

    return <Box>{elem}</Box>;
};

export default EditableTypography;
