import { Box, Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { greyTextColour } from "../common";

const SectionLabelBox = withStyles((theme: Theme) => ({
    root: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
        color: greyTextColour,
        flexShrink: 1,
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
    },
}))(Box);

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
        <SectionLabelBox>
            <Typography variant="body1">{props.value}</Typography>
        </SectionLabelBox>
    );
};

export default SectionLabel;
