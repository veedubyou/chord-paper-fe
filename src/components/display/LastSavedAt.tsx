import {
    StyledComponentProps,
    Typography as UnstyledTypography,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/styles";
import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";

const Typography = withStyles({
    root: {
        color: grey[600],
    },
})(UnstyledTypography);

interface LastSavedAtProps extends StyledComponentProps {
    lastSaved: Date;
}

const LastSavedAt: React.FC<LastSavedAtProps> = (
    props: LastSavedAtProps
): JSX.Element => {
    const [, setLastRefreshed] = useState<Date>(new Date());

    const timeDescription = (): string => {
        const lastSaved = DateTime.fromJSDate(props.lastSaved);
        const sinceSaved: Duration = lastSaved.diffNow();

        const daysSinceSaved: number = sinceSaved.as("day");
        if (daysSinceSaved <= -1) {
            return lastSaved.toLocaleString(DateTime.DATE_MED);
        }

        const secondsSinceSaved: number = lastSaved.diffNow().as("second");
        if (secondsSinceSaved >= -1) {
            return "just now";
        }

        const relativeDescription = lastSaved.toRelative();
        if (relativeDescription === null) {
            return "WHAT IS HAPPENING? CONTACT YOUR DEV";
        }

        return relativeDescription;
    };

    useEffect(() => {
        const interval = setInterval(() => setLastRefreshed(new Date()), 30000);
        return () => clearInterval(interval);
    }, [setLastRefreshed]);

    return (
        <Typography
            classes={props.classes}
            variant="caption"
        >{`Last Saved: ${timeDescription()}`}</Typography>
    );
};

export default LastSavedAt;
