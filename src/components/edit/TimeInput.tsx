import { IconButton, InputAdornment, Theme } from "@material-ui/core";
import SlowMotionVideoIcon from "@material-ui/icons/SlowMotionVideo";
import { StyledComponentProps, withStyles } from "@material-ui/styles";
import { Duration } from "luxon";
import React, { useState } from "react";
import { widthOfString } from "../track_player/common";
import UnstyledControlledTextInput from "./ControlledTextInput";

interface TimeInputProps extends StyledComponentProps {
    seconds: number | null;
    onFinish?: (newSeconds: number | null) => void;
}

const ControlledTextInput = withStyles((theme: Theme) => ({
    root: {
        textAlign: "right",
        width: widthOfString(theme, "body1", "00:00"),
    },
}))(UnstyledControlledTextInput);

const TimeInput: React.FC<TimeInputProps> = (
    props: TimeInputProps
): JSX.Element => {
    const initialValue: string = (() => {
        if (props.seconds === null) {
            return "";
        }

        const duration = Duration.fromMillis(props.seconds * 1000);
        return duration.toFormat("mss");
    })();
    const [value, setValue] = useState<string>(initialValue);

    const decomposeTimeString = (timeString: string): [number, number] => {
        const numericValue = Number(timeString);

        const secondsPart = numericValue % 100;
        const minutesPart = Math.floor(numericValue / 100);
        return [minutesPart, secondsPart];
    };

    const validateCurrentTimeValue = (): boolean => {
        if (value === "") {
            return true;
        }

        const [minutesPart, secondsPart] = decomposeTimeString(value);

        if (isNaN(minutesPart) || isNaN(secondsPart)) {
            return false;
        }

        if (secondsPart > 59 || secondsPart < 0) {
            return false;
        }

        return true;
    };

    const sanitizeValue = (newTime: string): string => {
        let sanitizedValue = newTime.replaceAll(/\D/g, "");

        if (sanitizedValue === "0") {
            return "000";
        }

        if (sanitizedValue === "00") {
            return "";
        }

        sanitizedValue = sanitizedValue.replace(/^0+/, "");
        return sanitizedValue;
    };

    const handleValueChange = (newTime: string): void => {
        setValue(sanitizeValue(newTime));
    };

    const finish = () => {
        if (value === "") {
            props.onFinish?.(null);
            return;
        }

        const [minutes, seconds] = decomposeTimeString(value);

        props.onFinish?.(60 * minutes + seconds);
    };

    const buttonAdornment = (
        <InputAdornment position="start">
            <IconButton edge="start">
                <SlowMotionVideoIcon />
            </IconButton>
        </InputAdornment>
    );

    const formatValue = (timeString: string): string => {
        if (timeString === "") {
            return "";
        }

        if (timeString.length === 1) {
            return "0:0" + timeString;
        }

        if (timeString.length === 2) {
            return "0:" + timeString;
        }

        const colonIndex = timeString.length - 2;
        const minutesPart = timeString.substring(0, colonIndex);
        const secondsPart = timeString.substring(colonIndex);
        return minutesPart + ":" + secondsPart;
    };

    const formattedValue = formatValue(value);
    const error = !validateCurrentTimeValue();

    return (
        <ControlledTextInput
            placeholder="0:00"
            value={formattedValue}
            onValueChange={handleValueChange}
            variant="standard"
            typographyVariant="body1"
            onFinish={finish}
            paddingSpacing={0.5}
            error={error}
            InputProps={{
                startAdornment: buttonAdornment,
                disableUnderline: true,
            }}
        />
    );
};

export default TimeInput;
