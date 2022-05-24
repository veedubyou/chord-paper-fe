import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import { IconButton, InputAdornment, styled } from "@mui/material";
import { StyledComponentProps } from "@mui/styles";
import { Duration } from "luxon";
import React, { useContext, useRef, useState } from "react";
import { PlayerTimeContext } from "../PlayerTimeContext";
import { widthOfString } from "../track_player/common";
import UnstyledControlledTextInput from "./ControlledTextInput";

interface TimeInputProps extends StyledComponentProps {
    seconds: number | null;
    onFinish?: (newSeconds: number | null) => void;
}

const ControlledTextInput = styled(UnstyledControlledTextInput)(
    ({ theme }) => ({
        textAlign: "right",
        width: widthOfString(theme, "body1", "00:00"),
    })
);

const TimeInput: React.FC<TimeInputProps> = (
    props: TimeInputProps
): JSX.Element => {
    const secondsToString = (seconds: number | null): string => {
        if (seconds === null) {
            return "";
        }

        const duration = Duration.fromMillis(seconds * 1000);
        return duration.toFormat("mss");
    };

    const initialValue: string = secondsToString(props.seconds);
    const [value, setValue] = useState<string>(initialValue);
    const inputBoxRef = useRef<any>(null); // pretty awful but this is the type from TextFieldProps

    const getPlayerTimeRef = useContext(PlayerTimeContext);

    const decomposeTimeString = (timeString: string): [number, number] => {
        const numericValue = Number(timeString);

        const secondsPart = numericValue % 100;
        const minutesPart = Math.floor(numericValue / 100);
        return [minutesPart, secondsPart];
    };

    const validateTimeValue = (time: string): boolean => {
        if (time === "") {
            return true;
        }

        const [minutesPart, secondsPart] = decomposeTimeString(time);

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

    const finish = (newTime: string) => {
        if (newTime === "") {
            props.onFinish?.(null);
            return;
        }

        if (!validateTimeValue(newTime)) {
            return;
        }

        const [minutes, seconds] = decomposeTimeString(newTime);

        props.onFinish?.(60 * minutes + seconds);
    };

    const handleCurrentTimeButton = () => {
        const currentGetPlayerTime = getPlayerTimeRef.current;
        if (currentGetPlayerTime === null) {
            return;
        }

        const playerTimeSeconds: number = currentGetPlayerTime();
        const newValue = secondsToString(playerTimeSeconds);
        setValue(newValue);
        finish(newValue);

        // put the focus back into the input box
        if (
            inputBoxRef.current !== null &&
            inputBoxRef.current.focus !== undefined &&
            inputBoxRef.current.focus !== null
        ) {
            inputBoxRef.current.focus();
        }
    };

    const buttonAdornment = (
        <InputAdornment position="start">
            <IconButton
                edge="start"
                onClick={handleCurrentTimeButton}
                size="large"
            >
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
    const error = !validateTimeValue(value);

    return (
        <ControlledTextInput
            placeholder="0:00"
            value={formattedValue}
            onValueChange={handleValueChange}
            variant="standard"
            typographyVariant="body1"
            onFinish={() => finish(value)}
            paddingSpacing={0.5}
            error={error}
            InputProps={{
                startAdornment: buttonAdornment,
                disableUnderline: !error,
            }}
            inputRef={inputBoxRef}
        />
    );
};

export default TimeInput;
