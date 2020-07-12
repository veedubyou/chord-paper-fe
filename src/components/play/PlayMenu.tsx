import { Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UnstyledMenuIcon from "@material-ui/icons/Menu";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";

interface PlayMenuProps {
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
                icon={<ExitToAppIcon />}
                tooltipTitle="Exit Play Mode"
                onMouseDownCapture={handleExit}
            />
        </SpeedDial>
    );
};

export default PlayMenu;
