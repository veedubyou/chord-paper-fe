import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

const BeginningIcon: React.FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path d="M6 6h2v12h-2z m1.5 6l8 6V6z m7 0 l8 6V6z" />
        </SvgIcon>
    );
};

export default BeginningIcon;
