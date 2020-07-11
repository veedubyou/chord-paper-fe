import { Theme } from "@material-ui/core";
import UnstyledMenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import grey from "@material-ui/core/colors/grey";
import { Link, useHistory } from "react-router-dom";

interface ChordPaperMenuProps {
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

const PlayMenu: React.FC<ChordPaperMenuProps> = (
    props: ChordPaperMenuProps
): JSX.Element => {
    const [open, setOpen] = useState(false);
    const history = useHistory();

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const handleExit = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        history.push("/song");
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
