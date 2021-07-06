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
    children: React.ReactNode[];
    dividers: "left" | "right";
}

const ControlGroup: React.FC<ControlGroupProps> = (
    props: ControlGroupProps
): JSX.Element => {
    const contents: React.ReactElement[] = props.children.map(
        (child: React.ReactNode, index: number) => {
            const content: React.ReactNode[] = (() => {
                if (props.dividers === "right") {
                    return [
                        child,
                        <VerticalMiddleDivider
                            key={`divider-${index}`}
                            orientation="vertical"
                            flexItem
                        />,
                    ];
                }

                return [
                    <VerticalMiddleDivider
                        key={`divider-${index}`}
                        orientation="vertical"
                        flexItem
                    />,
                    child,
                ];
            })();

            return <React.Fragment key={index}>{content}</React.Fragment>;
        }
    );

    return <ControlGroupBox>{contents}</ControlGroupBox>;
};

export default ControlGroup;
