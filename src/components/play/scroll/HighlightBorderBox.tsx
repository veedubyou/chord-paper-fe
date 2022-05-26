import { Box, Theme } from "@mui/material";
import React from "react";
import { MUIStyledProps } from "../../../common/styledProps";
import { useHighlightBorders } from "./highlightBorderContext";

const transitionFunction = "cubic-bezier(.19,1,.22,1)";

interface HighlightBorderBoxProps {
    highlight?: boolean;
    children: React.ReactElement;
    lyrics: string;
}

interface BorderBoxProps extends HighlightBorderBoxProps, MUIStyledProps {}

const BorderBox = React.memo(
    React.forwardRef(
        (
            props: BorderBoxProps,
            ref: React.ForwardedRef<Element>
        ): JSX.Element => {
            console.log("rerendering: ", props.lyrics, props.highlight);

            return (
                <Box
                    ref={ref}
                    className={props.className}
                    sx={(theme: Theme) => ({
                        borderColor: "transparent",
                        borderStyle: "dashed",
                        borderRadius: theme.spacing(1.5),
                        borderWidth: theme.spacing(0.3),
                        transition: `border-color ${transitionFunction} 2s`,
                    })}
                >
                    {props.children}
                </Box>
            );
        }
    )
);

const HighlightBorderBox = React.forwardRef(
    (
        props: HighlightBorderBoxProps,
        ref: React.ForwardedRef<Element>
    ): JSX.Element => {
        const highlightClassName = useHighlightBorders();

        const containerClassName: string | undefined = (() => {
            if (props.highlight === true) {
                return highlightClassName;
            }

            return undefined;
        })();

        return (
            <BorderBox
                ref={ref}
                className={containerClassName}
                lyrics={props.lyrics}
            >
                {props.children}
            </BorderBox>
        );
    }
);

export default HighlightBorderBox;
