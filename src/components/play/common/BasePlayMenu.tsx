import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UnstyledMoreVertIcon from "@mui/icons-material/MoreVert";
import { SpeedDial as UnstyledSpeedDial, SpeedDialAction, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import { PlainFn } from "../../../common/PlainFn";

interface BasePlayMenuProps {
    children: React.ReactElement | React.ReactElement[];
    onExit?: PlainFn;
}

const MenuIcon = styled(UnstyledMoreVertIcon)({
        backgroundColor: "transparent",
    });

const SpeedDial = styled(UnstyledSpeedDial)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(3),
    right: theme.spacing(2),
    "& .MuiSpeedDial-fab": {
        backgroundColor: "transparent",
        color: grey[500],
    },
}));

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
