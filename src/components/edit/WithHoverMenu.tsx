import { Button as UnstyledButton, ButtonGroup, Theme, Tooltip as UnstyledTooltip } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import React from "react";
import { DataTestID } from "../../common/DataTestID";

const Button = withStyles((theme: Theme) => ({
    contained: {
        backgroundColor: "transparent",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))(UnstyledButton);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
        background: "transparent",
        margin: 0,
    },
})(UnstyledTooltip);

export interface MenuItem extends DataTestID {
    icon: React.ReactElement;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface WithHoverMenuProps {
    children: React.ReactElement;
    menuItems: MenuItem[];
}

const WithHoverMenu: React.FC<WithHoverMenuProps> = (
    props: WithHoverMenuProps
): JSX.Element => {
    const hoverMenu = (
        <ButtonGroup orientation="vertical" variant="text">
            {props.menuItems.map((menuItem: MenuItem, index: number) => {
                return (
                    <Button
                        key={index}
                        onClick={menuItem.onClick}
                        data-testid={menuItem["data-testid"]}
                    >
                        {menuItem.icon}
                    </Button>
                );
            })}
        </ButtonGroup>
    );

    return (
        <Tooltip placement="right" title={hoverMenu}>
            {props.children}
        </Tooltip>
    );
};

export default WithHoverMenu;
