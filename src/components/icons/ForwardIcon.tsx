import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

const ForwardIcon: React.FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M18,13c0,3.31-2.69,6-6,6s-6-2.69-6-6s2.69-6,6-6v4l5-5l-5-5v4c-4.42,0-8,3.58-8,8c0,4.42,3.58,8,8,8c4.42,0,8-3.58,8-8 H18z" />
        </SvgIcon>
    );
};

export default ForwardIcon;
