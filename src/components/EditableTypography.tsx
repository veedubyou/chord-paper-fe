import { Box, Typography, TypographyProps } from "@material-ui/core";
import React, { useState } from "react";
import TextInput from "./TextInput";

import { DataTestID } from "../common/DataTestID";
import { inflateIfEmpty } from "../common/Whitespace";
import { withStyles } from "@material-ui/styles";

import grey from "@material-ui/core/colors/grey";

interface EditableTypographyProps extends DataTestID, TypographyProps {
    children: string;
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
    const [editing, setEditing] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = (newValue: string) => {
        setEditing(false);
        if (props.onValueChange) {
            props.onValueChange(newValue);
        }
    };

    const nonEditableLine = (): React.ReactElement => {
        const {
            children,
            placeholder,
            onValueChange,
            ...typographyProps
        } = props;

        if (props.children === "" && props.placeholder !== undefined) {
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
