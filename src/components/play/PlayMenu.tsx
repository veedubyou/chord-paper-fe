import { Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TuneIcon from "@material-ui/icons/Tune";

import UnstyledMenuIcon from "@material-ui/icons/Menu";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import DisplaySettings from "./DisplaySettings";
import { PlayFormatting } from "./PlayContent";

interface PlayMenuProps {
    formatting: PlayFormatting;
    onFormattingChange?: (formatting: PlayFormatting) => void;
    onExit?: () => void;
}

const MenuIcon = withStyles({
    root: {
        backgroundColor: "transparent",
    },
})(UnstyledMenuIcon);

const SpeedDial = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        top: theme.spacing(2),
        right: theme.spacing(2),
        "& .MuiSpeedDial-fab": {
            backgroundColor: "transparent",
            color: grey[500],
        },
    },
}))(UnstyledSpeedDial);

const PlayMenu: React.FC<PlayMenuProps> = (
    props: PlayMenuProps
): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [displaySettingsOpen, setDisplaySettingsOpen] = useState(false);

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const handleExit = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        props.onExit?.();
        event.stopPropagation();
    };

    const handleFormattingChange = (settings: PlayFormatting) => {
        props.onFormattingChange?.(settings);
        setDisplaySettingsOpen(false);
    };

    // returning this instead of shoving it in the same fragment because
    // returning speed dial in a fragment somehow causes some layout changes
    if (displaySettingsOpen) {
        return (
            <DisplaySettings
                open
                onClose={() => setDisplaySettingsOpen(false)}
                defaultSettings={props.formatting}
                onSubmit={handleFormattingChange}
            />
        );
    }

    return (
        <SpeedDial
            icon={<MenuIcon />}
            direction="down"
            open={open}
            onOpen={openMenu}
            onClose={closeMenu}
            ariaLabel="SpeedDial"
            FabProps={{
                color: "inherit",
            }}
        >
            <SpeedDialAction
                icon={<TuneIcon />}
                tooltipTitle="Display Settings"
                onMouseDownCapture={() => setDisplaySettingsOpen(true)}
            />
            <SpeedDialAction
                icon={<ExitToAppIcon />}
                tooltipTitle="Exit Play Mode"
                onMouseDownCapture={handleExit}
            />
        </SpeedDial>
    );
};

export default PlayMenu;
