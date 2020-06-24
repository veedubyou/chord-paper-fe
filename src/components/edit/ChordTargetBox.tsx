import { StyledComponentProps, withStyles } from "@material-ui/core";
import React from "react";
import { LyricTypography, lyricTypographyProps } from "../display/Lyric";

const InvisibleTypography = withStyles({
    root: {
        color: "transparent",
        cursor: "pointer",
        userSelect: "none",
        position: "absolute",
        left: 0,
        top: 0,
        transform: "translate(0%, -115%)",
    },
})(LyricTypography);

export interface ChordTargetBoxProps extends StyledComponentProps {
    children: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export const ChordTargetBox: React.FC<ChordTargetBoxProps> = (
    props: ChordTargetBoxProps
): JSX.Element => {
    return (
        <InvisibleTypography
            {...lyricTypographyProps}
            onClick={props.onClick}
            classes={props.classes}
            className={props.className}
            data-testid="ChordEditButton"
        >
            {props.children}
        </InvisibleTypography>
    );
};

export default ChordTargetBox;
