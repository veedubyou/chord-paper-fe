import { styled, Typography as UnstyledTypography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";
import { MUIStyledProps } from "../../common/styledProps";

const Typography = styled(UnstyledTypography)({
    color: grey[600],
});

interface LastSavedAtProps extends MUIStyledProps {
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
            variant="caption"
            className={props.className}
        >{`Last Saved: ${timeDescription()}`}</Typography>
    );
};

export default LastSavedAt;
