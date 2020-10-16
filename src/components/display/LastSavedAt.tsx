import { StyledComponentProps, Typography } from "@material-ui/core";
import React from "react";

interface LastSavedAtProps extends StyledComponentProps {
    date: string;
}

const LastSavedAt: React.FC<LastSavedAtProps> = (
    props: LastSavedAtProps
): JSX.Element => {
    return (
        <Typography
            classes={props.classes}
            variant="caption"
        >{`Last Saved: ${props.date}`}</Typography>
    );
};

export default LastSavedAt;
