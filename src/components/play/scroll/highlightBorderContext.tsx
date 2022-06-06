import { Theme } from "@mui/material";
import { noopFn, PlainFn } from "common/PlainFn";
import React, { useCallback, useMemo, useRef } from "react";
import { useDebouncedCallback } from "use-debounce/lib";

export type HighlightBorder = {
    getBorderColour: () => HighlightColour;
    rotateBorderColour: PlainFn;
};
export type HighlightColour = "blue" | "purple" | "red";

// adding a debounce interval - when scrolling multiple highlights could activate that
// rotates the colours a lot. this debounce keeps some stability in the colour rotation
// a more robust solution would be to time it against the time that the user recognizes
// a new colour emerging, but that requires more understanding into how to factor in
// the scroll time and the CSS transitions
const rotateColourDebounceTime = 300;

// a pastel-ish colour in the orange/red zone
// that still contrasts with blue and purple
const redColor = "#ff9679";

export const HighlightBorderContext =
    React.createContext<HighlightBorder>({
        getBorderColour: () => "red",
        rotateBorderColour: noopFn,
    });

interface HighlightBorderProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

const colourStyleMap = {
    blue: (theme: Theme) => ({ borderColor: theme.palette.primary.main }),
    purple: (theme: Theme) => ({ borderColor: theme.palette.secondary.main }),
    red: (theme: Theme) => ({ borderColor: redColor }),
};

export const useHighlightBorders = () => {
    const { getBorderColour: getColour } = React.useContext(HighlightBorderContext);

    const currentColour = getColour();
    return colourStyleMap[currentColour];
};

export const HighlightBorderProvider: React.FC<HighlightBorderProviderProps> = (
    props: HighlightBorderProviderProps
): JSX.Element => {
    const currentColourRef = useRef<HighlightColour>("red");

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

    const getColour = useCallback((): HighlightColour => {
        return currentColourRef.current;
    }, []);

    const colourContext = useMemo(
        (): HighlightBorder => ({
            getBorderColour: getColour,
            rotateBorderColour: rotateColour,
        }),
        [getColour, rotateColour]
    );

    return (
        <HighlightBorderContext.Provider value={colourContext}>
            {props.children}
        </HighlightBorderContext.Provider>
    );
};
