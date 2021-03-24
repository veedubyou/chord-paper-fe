import { Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { greyTextColour } from "./common";
import { VerticalMiddleDivider } from "./ControlGroup";

const SectionLabelTypography = withStyles((theme: Theme) => ({
    root: {
        marginLeft: theme.spacing(1.5),
        marginRight: theme.spacing(1.5),
        color: greyTextColour,
    },
}))(Typography);

interface SectionLabelProps {
    value: string;
    divider?: boolean;
}

const SectionLabel: React.FC<SectionLabelProps> = (
    props: SectionLabelProps
) => {
    if (props.value === "") {
        return null;
    }

    return (
        <>
            <SectionLabelTypography variant="body1">
                {props.value}
            </SectionLabelTypography>
            {props.divider && (
                <VerticalMiddleDivider orientation="vertical" flexItem />
            )}
        </>
    );
};

export default SectionLabel;
