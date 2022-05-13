import { Box, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { makeHighlightColours } from "./highlightColourContext";

const transitionFunction = "cubic-bezier(.19,1,.22,1)";

const BorderedBox = withStyles((theme: Theme) => ({
    root: {
        borderColor: "transparent",
        borderStyle: "dashed",
        borderRadius: theme.spacing(1.5),
        borderWidth: theme.spacing(0.3),
        transition: `border-color ${transitionFunction} 2s`,
    },
}))(Box);

const useHighlightBorder = makeHighlightColours();

interface HighlightBorderBoxProps {
    highlight?: boolean;
    children: React.ReactElement;
}

const HighlightBorderBox: React.FC<HighlightBorderBoxProps> = (
    props: HighlightBorderBoxProps
): JSX.Element => {
    const highlightBorderStyle = useHighlightBorder();

    const highlightClassName: string | undefined = (() => {
        if (props.highlight === true) {
            return highlightBorderStyle.root;
        }

        return undefined;
    })();

    return (
        <BorderedBox className={highlightClassName}>
            {props.children}
        </BorderedBox>
    );
};

export default HighlightBorderBox;
