import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import {
    SpeedDialAction
} from "@material-ui/lab";
import React from "react";
import { PlainFn } from "../../../common/PlainFn";
import BasePlayMenu from "../common/BasePlayMenu";

interface ScrollPlayMenuProps {
    onPageView?: PlainFn;
    onExit?: PlainFn;
}

const ScrollPlayMenu: React.FC<ScrollPlayMenuProps> = (
    props: ScrollPlayMenuProps
): JSX.Element => {
    return (
        <BasePlayMenu onExit={props.onExit}>
            <SpeedDialAction
                icon={<ChromeReaderModeIcon />}
                tooltipTitle="Page View"
                onMouseDownCapture={props.onPageView}
            />
        </BasePlayMenu>
    );
};

export default ScrollPlayMenu;
