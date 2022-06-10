import { Box, Divider, styled, Theme } from "@mui/material";
import { MUIStyledCommonProps } from "@mui/system";
import React from "react";

export const ControlGroupBox = styled(Box)({
    display: "flex",
    alignContent: "center",
    flexShrink: 0,
    flexGrow: 0,
    height: "100%",
});

export const VerticalMiddleDivider = styled(Divider)(({ theme }) => ({
    marginLeft: 0,
    marginRight: 0,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
}));

interface ControlGroupProps extends MUIStyledCommonProps<Theme> {
    children: React.ReactNode[];
    dividers: "left" | "right";
    edgeDivider?: boolean;
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
            const isEdge =
                (props.dividers === "left" && index === 0) ||
                (props.dividers === "right" &&
                    index === realContents.length - 1);

            if (props.edgeDivider !== true && isEdge) {
                return <React.Fragment key={index}>{child}</React.Fragment>;
            }

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

    return <ControlGroupBox sx={props.sx}>{contents}</ControlGroupBox>;
};

export default ControlGroup;
