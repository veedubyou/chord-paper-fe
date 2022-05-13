import { Theme } from "@material-ui/core";
import { ClassNameMap, makeStyles } from "@material-ui/styles";
import React, { useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce/lib";

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

const HighlightBorderContext = React.createContext<() => HighlightColour>(
    () => "red"
);

interface HighlightColourProviderProps {
    children: React.ReactNode | React.ReactNode[];
}

type MakeHighlightColoursMapType = {
    blue: ReturnType<typeof makeStyles>;
    purple: ReturnType<typeof makeStyles>;
    red: ReturnType<typeof makeStyles>;
};

const useHighlightBorders = (
    colourMap: MakeHighlightColoursMapType
): ClassNameMap<"root"> => {
    const getAndRotateCurrentColour = React.useContext(HighlightBorderContext);
    const currentColour = getAndRotateCurrentColour();

    const highlightColourStyles = {
        blue: colourMap["blue"]({}),
        purple: colourMap["purple"]({}),
        red: colourMap["red"]({}),
    };

    return highlightColourStyles[currentColour];
};

type useRootStyleType = () => ClassNameMap<"root">;

export const makeHighlightBorders = (): useRootStyleType => {
    const useHighlightColoursMap: MakeHighlightColoursMapType = {
        blue: makeStyles((theme: Theme) => ({
            root: {
                borderColor: theme.palette.primary.main,
            },
        })),
        purple: makeStyles((theme: Theme) => ({
            root: {
                borderColor: theme.palette.secondary.main,
            },
        })),
        red: makeStyles((theme: Theme) => ({
            root: {
                borderColor: redColor,
            },
        })),
    };

    return () => useHighlightBorders(useHighlightColoursMap);
};

export const HighlightColourProvider: React.FC<HighlightColourProviderProps> = (
    props: HighlightColourProviderProps
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

    const getAndRotateColour = useCallback((): HighlightColour => {
        const currentColour = currentColourRef.current;
        rotateColour();
        return currentColour;
    }, [rotateColour]);

    return (
        <HighlightBorderContext.Provider value={getAndRotateColour}>
            {props.children}
        </HighlightBorderContext.Provider>
    );
};
