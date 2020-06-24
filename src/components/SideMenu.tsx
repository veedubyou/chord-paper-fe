import React, { useState } from "react";
import {
    Drawer,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
    Theme,
    Collapse,
    ListItemIcon,
    Paper,
    Grid,
    Box,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PetsIcon from "@material-ui/icons/Pets";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import StoreIcon from "@material-ui/icons/Store";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UnstyledMenuIcon from "@material-ui/icons/Menu";
import UnstyledCloseIcon from "@material-ui/icons/Close";

import { withStyles } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";
import { allExerciseRoutes, ExerciseRoute } from "./Tutorial";

const MenuIcon = withStyles({
    root: {
        cursor: "pointer",
    },
})(UnstyledMenuIcon);

const CloseIcon = withStyles({
    root: {
        cursor: "pointer",
        float: "right",
        verticalAlign: "middle",
    },
})(UnstyledCloseIcon);

const VerticalGridItem = withStyles({
    root: {
        maxWidth: "none",
    },
})(Grid);

const TitleBox = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
    },
}))(Box);

const TitleName = withStyles((theme: Theme) => ({
    root: {
        color: grey[600],
    },
}))(Typography);

const CollapsedMenuSurface = withStyles({
    root: {
        minWidth: "24px",
        height: "100vh",
    },
})(Paper);

const FullHeightGrid = withStyles({
    root: {
        height: "100%",
        width: "100%",
    },
})(Grid);

const SideMenu: React.FC<{}> = (): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [learnSubmenuOpen, setLearnSubMenuOpen] = useState(false);

    const typographyProps = {
        variant: "h6" as "h6",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "inherit",
    };

    const collapsedMenu = () => {
        return (
            <Grid container>
                <Grid item xs={6}>
                    <CollapsedMenuSurface>
                        <FullHeightGrid
                            container
                            direction="column"
                            alignContent="center"
                        >
                            <VerticalGridItem item xs={1}></VerticalGridItem>
                            <VerticalGridItem item xs={1}>
                                <MenuIcon onClick={() => setOpen(true)} />
                            </VerticalGridItem>
                            <VerticalGridItem item xs={10}></VerticalGridItem>
                        </FullHeightGrid>
                    </CollapsedMenuSurface>
                </Grid>
                <Grid item xs={6}></Grid>
            </Grid>
        );
    };

    const learnClickHandler = () => {
        setLearnSubMenuOpen(!learnSubmenuOpen);
    };

    const tutorialMenu = () => {
        const exerciseLinks = allExerciseRoutes().map(
            (exerciseRoute: ExerciseRoute) => {
                return (
                    <Link
                        key={exerciseRoute.route}
                        to={exerciseRoute.route}
                        style={linkStyle}
                    >
                        <ListItem button>
                            <ListItemText inset primary={exerciseRoute.title} />
                        </ListItem>
                    </Link>
                );
            }
        );

        return (
            <>
                <ListItem key="Learn" button onClick={learnClickHandler}>
                    <ListItemIcon>
                        <FreeBreakfastIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary="Learn"
                        primaryTypographyProps={typographyProps}
                    />
                    {learnSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={learnSubmenuOpen} timeout="auto">
                    <List>{exerciseLinks}</List>
                </Collapse>
            </>
        );
    };

    return (
        <>
            {collapsedMenu()}
            <Drawer variant="persistent" open={open} anchor="left">
                <TitleBox>
                    <TitleName variant="h5" display="inline">
                        <Link
                            to="/"
                            style={linkStyle}
                            data-testid="Menu-TitleButton"
                        >
                            Chord Paper{" "}
                        </Link>
                    </TitleName>
                    <CloseIcon onClick={() => setOpen(false)} />
                </TitleBox>

                <Divider />
                <List>
                    <Link
                        key="/"
                        to="/"
                        style={linkStyle}
                        data-testid="Menu-HomeButton"
                    >
                        <ListItem key="Song" button>
                            <ListItemIcon>
                                <MusicNoteIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Song"
                                primaryTypographyProps={typographyProps}
                            />
                        </ListItem>
                    </Link>
                    <Link
                        key="/demo"
                        to="/demo"
                        style={linkStyle}
                        data-testid="Menu-DemoButton"
                    >
                        <ListItem key="Demo" button>
                            <ListItemIcon>
                                <StoreIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Demo"
                                primaryTypographyProps={typographyProps}
                            />
                        </ListItem>
                    </Link>
                    {tutorialMenu()}
                    <Link
                        key="/about"
                        to="/about"
                        style={linkStyle}
                        data-testid="Menu-AboutButton"
                    >
                        <ListItem key="About" button>
                            <ListItemIcon>
                                <PetsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="About"
                                primaryTypographyProps={typographyProps}
                            />
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
        </>
    );
};

export default SideMenu;
