import { Theme } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UnstyledMoreVertIcon from "@mui/icons-material/MoreVert";
import { SpeedDial as UnstyledSpeedDial, SpeedDialAction } from '@mui/material';
import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import { PlainFn } from "../../../common/PlainFn";
import { grey } from '@mui/material/colors';

interface BasePlayMenuProps {
    children: React.ReactElement | React.ReactElement[];
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

const BasePlayMenu: React.FC<BasePlayMenuProps> = (
    props: BasePlayMenuProps
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
            {props.children}
            <SpeedDialAction
                icon={<ExitToAppIcon />}
                tooltipTitle="Exit Play Mode"
                onMouseDownCapture={handleExit}
            />
        </SpeedDial>
    );
};

export default BasePlayMenu;
