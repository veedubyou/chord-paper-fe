import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

export const makeTextIcon = (
    textIconContent: string
): React.FC<SvgIconProps> => {
    return (props: SvgIconProps) => {
        return (
            <SvgIcon {...props}>
                <g>
                    <text
                        style={{ fontFamily: "Roboto", fontSize: "1.25rem" }}
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                    >
                        {textIconContent}
                    </text>
                </g>
            </SvgIcon>
        );
    };
};

