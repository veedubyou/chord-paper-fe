import { Box, CircularProgress, Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import React from "react";

interface LoadingSpinnerProps {
    size?: number;
    thickness?: number;
    sx?: SystemStyleObject<Theme>;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (
    props: LoadingSpinnerProps
): JSX.Element => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 0.5,
                ...props.sx,
            }}
        >
            <CircularProgress size={props.size} thickness={props.thickness} />
        </Box>
    );
};

export default LoadingSpinner;
