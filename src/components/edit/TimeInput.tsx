import CurrentTimeIcon from "@mui/icons-material/Downloading";
import {
    FormControl,
    IconButton,
    InputAdornment,
    inputBaseClasses,
    styled,
} from "@mui/material";
import { MUIStyledProps } from "common/styledProps";
import UnstyledControlledTextInput from "components/edit/ControlledTextInput";
import { PlayerTimeContext } from "components/PlayerTimeContext";
import { widthOfString } from "components/track_player/common";
import { Duration } from "luxon";
import React, { useContext, useRef, useState } from "react";

interface TimeInputProps extends MUIStyledProps {
    seconds: number | null;
    onFinish?: (newSeconds: number | null) => void;
    label?: string;
}

const ControlledTextInput = styled(UnstyledControlledTextInput)(
    ({ theme }) => ({
        [`& .${inputBaseClasses.input}`]: {
            textAlign: "right",
            width: widthOfString(theme, "body1", "00:00"),
        },
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
        const playerTimeSeconds: number | null = currentGetPlayerTime();
        if (playerTimeSeconds === null) {
            return;
        }

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
        <InputAdornment position="end">
            <IconButton
                edge="end"
                onClick={handleCurrentTimeButton}
                size="large"
                sx={{ padding: 0.5 }}
            >
                <CurrentTimeIcon />
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
        <FormControl variant="filled" sx={{ margin: 1 }}>
            <ControlledTextInput
                label={props.label}
                className={props.className}
                placeholder="0:00"
                value={formattedValue}
                onValueChange={handleValueChange}
                variant="outlined"
                typographyVariant="body1"
                onFinish={() => finish(value)}
                paddingSpacing={0.5}
                error={error}
                InputProps={{
                    endAdornment: buttonAdornment,
                    disableUnderline: !error,
                }}
                inputRef={inputBoxRef}
            />
        </FormControl>
    );
};

export default TimeInput;
