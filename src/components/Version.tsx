import { styled, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const PaddedTypography = styled(Typography)(({ theme }) => ({
    position: "absolute",
    top: 0,
    right: 0,
    padding: theme.spacing(1),
    color: grey[600],
}));

const Version: React.FC<{}> = (): JSX.Element => {
    const version: string = process.env.REACT_APP_VERSION ?? "dev-build";

    return <PaddedTypography variant="subtitle2">{version}</PaddedTypography>;
};

export default Version;
