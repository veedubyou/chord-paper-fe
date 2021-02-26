import { Button, Slide, Theme } from "@material-ui/core";
import RadioIcon from "@material-ui/icons/Radio";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { roundedTopCornersStyle, withBottomRightBox } from "./common";

const ExpandButton = withStyles((theme: Theme) => ({
    root: {
        ...roundedTopCornersStyle(theme),
    },
}))(Button);

interface CollapsedButtonProps {
    show: boolean;
    onExpand: () => void;
    className?: string;
}

const CollapsedButton: React.FC<CollapsedButtonProps> = (
    props: CollapsedButtonProps
): JSX.Element => {
    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                <ExpandButton
                    className={props.className}
                    onClick={props.onExpand}
                >
                    <RadioIcon />
                </ExpandButton>
            )}
        </Slide>
    );
};

export default CollapsedButton;
