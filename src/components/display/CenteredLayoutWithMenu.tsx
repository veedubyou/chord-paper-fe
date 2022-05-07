import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import SideMenu from "../SideMenu";
import Version from "../Version";
import Background from "../../assets/img/symphony.png";

const AppLayout = withStyles({
    root: {
        backgroundImage: `url(${Background})`,
        minHeight: "100vh",
    },
})(Grid);

interface CenteredLayoutWithMenuProps {
    children: React.ReactNode | React.ReactNode[];
    menuElement?: React.ReactElement;
}

const CenteredLayoutWithMenu: React.FC<CenteredLayoutWithMenuProps> = (
    props: CenteredLayoutWithMenuProps
): JSX.Element => {
    let menu: React.ReactElement = <SideMenu />
    if (props.menuElement !== undefined) {
        menu = props.menuElement;
    }

    return (
        <>
            {menu}
            <AppLayout container>
                <Grid item container justify="center">
                    {props.children}
                </Grid>
            </AppLayout>
            <Version />
        </>
    );
};

export default CenteredLayoutWithMenu;
