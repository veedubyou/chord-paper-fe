import { Box, CircularProgress, Theme } from "@material-ui/core";
import { StyledComponentProps, withStyles } from "@material-ui/styles";
import React from "react";

const CenteredBox = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: theme.spacing(0.5),
    },
}))(Box);

interface LoadingSpinnerProps extends StyledComponentProps {
    size?: number;
    thickness?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props: LoadingSpinnerProps): JSX.Element => {
    return (
        <CenteredBox classes={props.classes}>
            <CircularProgress size={props.size} thickness={props.thickness} />
        </CenteredBox>
    );
};

export default LoadingSpinner;
