import { Box, CircularProgress, Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import React from "react";

interface LoadingSpinnerProps {
    size?: number;
    thickness?: number;
    sx?: SystemStyleObject<Theme>;
}

const LoadingSpinner = React.forwardRef(
    (
        props: LoadingSpinnerProps,
        ref: React.ForwardedRef<Element>
    ): JSX.Element => {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ...props.sx,
                }}
                ref={ref}
            >
                <CircularProgress
                    size={props.size}
                    thickness={props.thickness}
                />
            </Box>
        );
    }
);

export default LoadingSpinner;
