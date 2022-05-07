import { Grid } from "@material-ui/core";
import React from "react";

interface CenteredLayoutProps {
    children: React.ReactNode | React.ReactNode[];
}

const CenteredLayout: React.FC<CenteredLayoutProps> = (
    props: CenteredLayoutProps
): JSX.Element => {
    return (
        <Grid container>
            <Grid item container justify="center">
                {props.children}
            </Grid>
        </Grid>
    );
};

export default CenteredLayout;