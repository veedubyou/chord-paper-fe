import {
    Box,
    Button,
    Slide,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { PlainFn } from "../../common/PlainFn";
import { CollapsibleMenuVisibility } from "./common";
import { ControlButton } from "./internal_player/ControlButton";
import PlayrateControl from "./internal_player/PlayrateControl";
import CloseIcon from "@material-ui/icons/Close";
import SharpFlatIcon from "./internal_player/SharpFlatIcon";

interface PlayrateMenuProps {
    visibility: CollapsibleMenuVisibility;
    playratePercentage: number;
    onPlayrateChange: (newPlayratePercentage: number) => void;
    onOpen: PlainFn;
    onClose: PlainFn;
}

const PlayrateMenu: React.FC<PlayrateMenuProps> = (
    props: PlayrateMenuProps
): JSX.Element => {
    const showControls = props.visibility === "expanded";
    const showCloseButton = props.visibility === "expanded";
    const showMenuButton =
        props.visibility === "collapsed" || props.visibility === "expanded";

    return (
        <>
            <Slide key="playrate-control" in={showControls} direction="left">
                <span>
                    <PlayrateControl
                        playratePercentage={props.playratePercentage}
                        onChange={props.onPlayrateChange}
                    />
                </span>
            </Slide>
            <Slide key="playrate-button" in={showMenuButton} direction="left">
                <Box>
                    <ControlButton.TogglePlayrateMenu onClick={props.onOpen} />
                </Box>
            </Slide>
            <Slide
                key="playrate-close-button"
                in={showCloseButton}
                direction="right"
            >
                <Box>
                    <ControlButton.CloseMenu onClick={props.onClose} />
                </Box>
            </Slide>
        </>
    );
};

export default PlayrateMenu;
