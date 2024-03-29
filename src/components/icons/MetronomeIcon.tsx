import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

const MetronomeIcon: React.FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <g transform="matrix(0.6,0,0,0.6,2.0242947,2.4014213)">
                <path d="m 16,21 c 0.3,0 0.6,-0.1 0.8,-0.4 l 13,-17 C 30.1,3.2 30.1,2.5 29.6,2.2 29.2,1.9 28.5,1.9 28.2,2.4 l -5.7,7.5 -1,-4.8 C 21.1,3.3 19.5,2 17.7,2 H 14.3 C 12.5,2 10.9,3.2 10.5,5 L 5.8,25.5 c -0.3,1.1 0,2.2 0.7,3.1 0.7,0.9 1.7,1.4 2.8,1.4 h 13.3 c 1.1,0 2.2,-0.5 2.9,-1.4 0.7,-0.9 0.9,-2 0.7,-3.1 L 23.7,15.8 C 23.6,15.3 23,14.9 22.5,15.1 22,15.2 21.6,15.8 21.8,16.3 l 1.5,5.8 H 8.6 L 12.4,5.6 c 0.2,-0.9 1,-1.5 1.8,-1.5 h 3.4 c 0.9,0 1.7,0.6 1.8,1.5 l 1.4,6.5 -5.6,7.4 c -0.3,0.4 -0.3,1.1 0.2,1.4 0.2,0 0.4,0.1 0.6,0.1 z" />
                <path d="m 15,8 h 2 C 17.6,8 18,7.6 18,7 18,6.4 17.6,6 17,6 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z" />
                <path d="m 15,11 h 2 c 0.6,0 1,-0.4 1,-1 0,-0.6 -0.4,-1 -1,-1 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z" />
                <path d="m 15,14 h 2 c 0.6,0 1,-0.4 1,-1 0,-0.6 -0.4,-1 -1,-1 h -2 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 z" />
            </g>
        </SvgIcon>
    );
};

export default MetronomeIcon;

