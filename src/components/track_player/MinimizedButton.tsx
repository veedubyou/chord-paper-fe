import { Button, Slide, Theme, Tooltip } from "@material-ui/core";
import RadioIcon from "@material-ui/icons/Radio";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { roundedTopCornersStyle, withBottomRightBox } from "./common";

const ExpandButton = withStyles((theme: Theme) => ({
    root: {
        ...roundedTopCornersStyle(theme),
    },
}))(Button);

interface MinimizedButtonProps {
    show: boolean;
    disabled?: boolean;
    tooltipMessage: string;
    onClick: () => void;
    className?: string;
}

const MinimizedButton: React.FC<MinimizedButtonProps> = (
    props: MinimizedButtonProps
): JSX.Element => {
    return (
        <Slide in={props.show} direction="up">
            {withBottomRightBox(
                // span inserted to workaround disabled elements with tooltip
                // https://material-ui.com/components/tooltips/#disabled-elements
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
            )}
        </Slide>
    );
};

export default MinimizedButton;
