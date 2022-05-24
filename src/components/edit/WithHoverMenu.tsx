import {
    Button,
    ButtonGroup,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps
} from "@mui/material";
import React from "react";
import { DataTestID } from "../../common/DataTestID";

const HoverMenuButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const TransparentTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        padding: "0px",
        backgroundColor: "transparent",
    },
    [`& .${tooltipClasses.tooltipPlacementRight}`]: {
        marginLeft: "0px",
    },
});

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
    const buttons = props.menuItems.map((item: MenuItem, index: number) => (
        <HoverMenuButton
            key={index}
            onClick={item.onClick}
            data-testid={item["data-testid"]}
        >
            {item.icon}
        </HoverMenuButton>
    ));

    const menuContents = (
        <ButtonGroup orientation="vertical" variant="text">
            {buttons}
        </ButtonGroup>
    );

    return (
        <TransparentTooltip
            placement="right"
            title={menuContents}
            open
            componentsProps={{
                popper: {
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 0],
                            },
                        },
                    ],
                },
            }}
        >
            {props.children}
        </TransparentTooltip>
    );
};

export default WithHoverMenu;
