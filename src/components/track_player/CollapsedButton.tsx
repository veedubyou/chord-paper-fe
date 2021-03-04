import { Button, Slide, Theme, Tooltip } from "@material-ui/core";
import RadioIcon from "@material-ui/icons/Radio";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { roundedTopCornersStyle, BottomRightBox } from "./common";

const ExpandButton = withStyles((theme: Theme) => ({
    root: {
        ...roundedTopCornersStyle(theme),
    },
}))(Button);

interface CollapsedButtonProps {
    show: boolean;
    disabled?: boolean;
    tooltipMessage: string;
    onClick: () => void;
    className?: string;
}

const CollapsedButton: React.FC<CollapsedButtonProps> = (
    props: CollapsedButtonProps
): JSX.Element => {
    return (
        // span inserted to workaround disabled elements with tooltip
        // https://material-ui.com/components/tooltips/#disabled-elements
        <Slide in={props.show} direction="up">
            <BottomRightBox>
                <Tooltip title={props.tooltipMessage}>
                    <span>
                        <ExpandButton
                            className={props.className}
                            onClick={props.onClick}
                            disabled={props.disabled}
                        >
                            <RadioIcon />
                        </ExpandButton>
                    </span>
                </Tooltip>
            </BottomRightBox>
        </Slide>
    );
};

export default CollapsedButton;
