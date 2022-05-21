import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

const SharpFlatIcon: React.FC<SvgIconProps> = (props: SvgIconProps) => {
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
                    ♯♭
                </text>
            </g>
        </SvgIcon>
    );
};

export default SharpFlatIcon;
