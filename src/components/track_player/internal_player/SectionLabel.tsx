import { Box, Typography } from "@mui/material";
import React from "react";
import { greyTextColour } from "../common";

interface SectionLabelProps {
    value: string;
}

const SectionLabel: React.FC<SectionLabelProps> = (
    props: SectionLabelProps
) => {
    if (props.value === "") {
        return null;
    }

    return (
        <Box
            sx={{
                marginLeft: 1.5,
                marginRight: 1.5,
                color: greyTextColour,
                flexShrink: 1,
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Typography variant="body1">{props.value}</Typography>
        </Box>
    );
};

export default SectionLabel;
