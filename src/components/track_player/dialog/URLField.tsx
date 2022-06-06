import { TextField } from "@mui/material";
import { textFieldValidation } from "components/track_player/dialog/error";
import { convertViewLinkToExportLink } from "components/track_player/internal_player/google_drive";
import React from "react";

interface URLFieldProps {
    labelText: string;
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
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
            disabled={props.disabled}
            {...textFieldValidation(props.value)}
        />
    );
};

export default URLField;
