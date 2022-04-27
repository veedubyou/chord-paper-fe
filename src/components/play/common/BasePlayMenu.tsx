import { Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import UnstyledMoreVertIcon from "@material-ui/icons/MoreVert";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { PlainFn } from "../../../common/PlainFn";

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
