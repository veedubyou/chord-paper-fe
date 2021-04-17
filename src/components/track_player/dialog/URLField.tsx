import { TextField } from "@material-ui/core";
import React from "react";
import { convertViewLinkToExportLink } from "../internal_player/google_drive";
import { textFieldValidation } from "./error";

interface URLFieldProps {
    labelText: string;
    value: string;
    onChange: (newValue: string) => void;
}

const URLField: React.FC<URLFieldProps> = (
    props: URLFieldProps
): JSX.Element => {
    const handleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        props.onChange(event.target.value);
    };

    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // only process for (CMD | CTRL) + g
        if (!event.metaKey && !event.ctrlKey) {
            return;
        }

        if (event.key !== "g" && event.key !== "G") {
            return;
        }

        const possiblyGoogleDriveViewLink: string = props.value;
        const result: string | null = convertViewLinkToExportLink(
            possiblyGoogleDriveViewLink
        );
        if (result === null) {
            return;
        }

        props.onChange(result);
        event.preventDefault();
    };

    return (
        <TextField
            label={props.labelText}
            variant="outlined"
            value={props.value}
            onChange={handleChange}
            onKeyDown={handleKey}
            {...textFieldValidation(props.value)}
        />
    );
};

export default URLField;
