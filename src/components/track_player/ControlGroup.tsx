import { Box, Divider, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const ControlGroupBox = withStyles({
    root: {
        display: "flex",
        alignContent: "center",
    },
})(Box);

export const VerticalMiddleDivider = withStyles((theme: Theme) => ({
    root: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: theme.spacing(1.5),
        marginBottom: theme.spacing(1.5),
    },
}))(Divider);

interface ControlGroupProps {
    children: React.ReactElement[];
}

const ControlGroup: React.FC<ControlGroupProps> = (
    props: ControlGroupProps
): JSX.Element => {
    const contents: React.ReactElement[] = props.children.map(
        (child: React.ReactElement) => {
            return (
                <>
                    {child}
                    <VerticalMiddleDivider orientation="vertical" flexItem />
                </>
            );
        }
    );

    return <ControlGroupBox>{contents}</ControlGroupBox>;
};

export default ControlGroup;
