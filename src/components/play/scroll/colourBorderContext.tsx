import { Theme } from "@mui/material";
import { noopFn, PlainFn } from "common/PlainFn";
import React, { useCallback, useMemo, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export type BorderFns = {
    getBorderColour: () => BorderColour;
    rotateBorderColour: PlainFn;
};
export type BorderColour = "blue" | "purple" | "red";

// adding a debounce interval - when scrolling multiple highlights could activate that
// rotates the colours a lot. this debounce keeps some stability in the colour rotation
// a more robust solution would be to time it against the time that the user recognizes
// a new colour emerging, but that requires more understanding into how to factor in
// the scroll time and the CSS transitions
const rotateColourDebounceTime = 300;

// a pastel-ish colour in the orange/red zone
// that still contrasts with blue and purple
const redColor = "#ff9679";

export const ColourBorderContext =
    React.createContext<BorderFns>({
        getBorderColour: () => "red",
        rotateBorderColour: noopFn,
    });

interface ColourBorderProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

const colourStyleMap = {
    blue: (theme: Theme) => ({ borderColor: theme.palette.primary.main }),
    purple: (theme: Theme) => ({ borderColor: theme.palette.secondary.main }),
    red: (theme: Theme) => ({ borderColor: redColor }),
};

export const useColourBorders = () => {
    const { getBorderColour: getColour } = React.useContext(ColourBorderContext);

    const currentColour = getColour();
    return colourStyleMap[currentColour];
};

export const ColourBorderProvider: React.FC<ColourBorderProviderProps> = (
    props: ColourBorderProviderProps
): JSX.Element => {
    const currentColourRef = useRef<BorderColour>("red");

    const rotateColour = useDebouncedCallback(
        () => {
            switch (currentColourRef.current) {
                case "blue": {
                    currentColourRef.current = "purple";
                    break;
                }

                case "purple": {
                    currentColourRef.current = "red";
                    break;
                }

                case "red": {
                    currentColourRef.current = "blue";
                    break;
                }
            }
        },
        rotateColourDebounceTime,
        { leading: false, trailing: true }
    );

    const getColour = useCallback((): BorderColour => {
        return currentColourRef.current;
    }, []);

    const colourContext = useMemo(
        (): BorderFns => ({
            getBorderColour: getColour,
            rotateBorderColour: rotateColour,
        }),
        [getColour, rotateColour]
    );

    return (
        <ColourBorderContext.Provider value={colourContext}>
            {props.children}
        </ColourBorderContext.Provider>
    );
};
