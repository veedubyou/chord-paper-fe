import React from "react";
import { Typography, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";

const PaddedTypography = withStyles((theme: Theme) => ({
    root: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: theme.spacing(1),
        color: grey[600],
    },
}))(Typography);

const Version: React.FC<{}> = (): JSX.Element => {
    const version: string = process.env.REACT_APP_VERSION ?? "dev-build";

    return <PaddedTypography variant="subtitle2">{version}</PaddedTypography>;
};

export default Version;
