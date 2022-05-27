import { Button, ButtonGroup, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { DataTestID } from "../../common/DataTestID";
import { makeStyledTooltip } from "./StyledTooltip";

const HoverMenuButton = styled(Button)({
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: grey[200],
    },
});

const TransparentTooltip = makeStyledTooltip(() => ({
    padding: "0px",
    // !important is awful. however MUI keeps overriding the specified style
    // and there isn't a good guide on how to compose this properly
    // so that the customized style is observed. be great to fix this in the future
    margin: "0px !important",
    backgroundColor: "transparent",
}));

// const TransparentTooltip = styled(({ className, ...props }: TooltipProps) => (
//     <Tooltip {...props} classes={{ popper: className }} />
// ))({
//     [`& .${tooltipClasses.tooltip}`]: {

//     },
// });

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
        <TransparentTooltip placement="right" title={menuContents}>
            {props.children}
        </TransparentTooltip>
    );
};

export default WithHoverMenu;
