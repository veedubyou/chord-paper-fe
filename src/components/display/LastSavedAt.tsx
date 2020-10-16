import { StyledComponentProps, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface LastSavedAtProps extends StyledComponentProps {
    lastSaved: Date;
}

const LastSavedAt: React.FC<LastSavedAtProps> = (
    props: LastSavedAtProps
): JSX.Element => {
    const [, setLastRefreshed] = useState<Date>(new Date());

    const timeDescription = (): string => {
        const lastSaved = DateTime.fromJSDate(props.lastSaved);
        const hoursSinceSaved: number = lastSaved.diffNow().as("hours");
        if (hoursSinceSaved <= -1) {
            return lastSaved.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
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
