import { Box, Divider, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

export const ControlGroupBox = withStyles({
    root: {
        display: "flex",
        alignContent: "center",
        flexShrink: 0,
        flexGrow: 0,
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
    const isRealNode = (node: React.ReactNode): boolean => {
        return node !== null && node !== undefined;
    };

    const realContents: React.ReactNode[] = props.children.filter(isRealNode);

    const contents: React.ReactElement[] = realContents.map(
        (child: React.ReactNode, index: number) => {
            const divider = (
                <VerticalMiddleDivider
                    key={`divider-${index}`}
                    orientation="vertical"
                    flexItem
                />
            );

            const content: React.ReactNode[] =
                props.dividers === "right"
                    ? [child, divider]
                    : [divider, child];

            return <React.Fragment key={index}>{content}</React.Fragment>;
        }
    );

    return <ControlGroupBox>{contents}</ControlGroupBox>;
};

export default ControlGroup;
