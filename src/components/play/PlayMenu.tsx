import { Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TuneIcon from "@material-ui/icons/Tune";
import RadioIcon from "@material-ui/icons/Radio";

import UnstyledMoreVertIcon from "@material-ui/icons/MoreVert";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import DisplaySettingsDialog from "./DisplaySettingsDialog";
import { DisplaySettings } from "./PlayContent";
import { PlainFn } from "../../common/PlainFn";
import PlayerSettingsDialog, { PlayerSettings } from "./PlayerSettingsDialog";

interface PlayMenuProps {
    displaySettings: DisplaySettings;
    onDisplaySettingsChange?: (displaySettings: DisplaySettings) => void;

    playerSettings: PlayerSettings;
    onPlayerSettingsChange?: (playerSettings: PlayerSettings) => void;

    onExit?: PlainFn;
}

const MenuIcon = withStyles({
    root: {
        backgroundColor: "transparent",
    },
})(UnstyledMoreVertIcon);

const SpeedDial = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        top: theme.spacing(3),
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
    const [playerSettingsOpen, setPlayerSettingsOpen] = useState(false);

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

    // returning this instead of shoving it in the same fragment because
    // returning speed dial in a fragment somehow causes some layout changes
    if (displaySettingsOpen) {
        const handleDisplaySettingsChange = (settings: DisplaySettings) => {
            props.onDisplaySettingsChange?.(settings);
            setDisplaySettingsOpen(false);
        };

        return (
            <DisplaySettingsDialog
                open
                onClose={() => setDisplaySettingsOpen(false)}
                defaultSettings={props.displaySettings}
                onSubmit={handleDisplaySettingsChange}
            />
        );
    }

    if (playerSettingsOpen) {
        const handlePlayerSettingsChange = (settings: PlayerSettings) => {
            props.onPlayerSettingsChange?.(settings);
            setPlayerSettingsOpen(false);
        };

        return (
            <PlayerSettingsDialog
                open
                onClose={() => setPlayerSettingsOpen(false)}
                defaultSettings={props.playerSettings}
                onSubmit={handlePlayerSettingsChange}
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
                icon={<RadioIcon />}
                tooltipTitle="Player Settings"
                onMouseDownCapture={() => setPlayerSettingsOpen(true)}
            />
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
