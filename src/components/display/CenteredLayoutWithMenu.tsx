import { Grid, styled } from "@mui/material";
import React from "react";
import Background from "../../assets/img/symphony.png";
import SideMenu from "../SideMenu";
import Version from "../Version";

const AppLayout = styled(Grid)({
    backgroundImage: `url(${Background})`,
    minHeight: "100vh",
});

interface CenteredLayoutWithMenuProps {
    children: React.ReactNode | React.ReactNode[];
    menuElement?: React.ReactElement;
}

const CenteredLayoutWithMenu: React.FC<CenteredLayoutWithMenuProps> = (
    props: CenteredLayoutWithMenuProps
): JSX.Element => {
    let menu: React.ReactElement = <SideMenu />;
    if (props.menuElement !== undefined) {
        menu = props.menuElement;
    }

    return (
        <>
            {menu}
            <AppLayout container>
                <Grid item container justifyContent="center">
                    {props.children}
                </Grid>
            </AppLayout>
            <Version />
        </>
    );
};

export default CenteredLayoutWithMenu;
