import React from "react";
import { Typography, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const AbsoluteTypography = withStyles((theme: Theme) => ({
  root: {
    position: "absolute",
    right: 0,
    color: "grey",
    "font-size": "1.5vh",
  },
}))(Typography);

const Version: React.FC<{}> = (): JSX.Element => {
    return (
        <AbsoluteTypography>{ process.env.REACT_APP_VERSION ?? "dev-build" }</AbsoluteTypography>
    );
};

export default Version;

