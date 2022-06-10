import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

export const makeRobotoIcon = (textIconContent: string) => {
    return makeTextIcon(textIconContent, "Roboto", "1.25rem", "middle");
};

export const makePressStartIcon = (textIconContent: string) => {
    return makeTextIcon(textIconContent, "PressStart", "1rem", "mathematical");
};

export const makeTextIcon = (
    textIconContent: string,
    fontFamily: string,
    fontSize: string,
    dominantBaseLine: "middle" | "mathematical"
): React.FC<SvgIconProps> => {
    return (props: SvgIconProps) => {
        return (
            <SvgIcon {...props}>
                <g>
                    <text
                        style={{ fontFamily: fontFamily, fontSize: fontSize }}
                        x="50%"
                        y="50%"
                        dominant-baseline={dominantBaseLine}
                        text-anchor="middle"
                    >
                        {textIconContent}
                    </text>
                </g>
            </SvgIcon>
        );
    };
};

