import {
    Collapse,
    Divider,
    Drawer as UnstyledDrawer,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Theme,
    Typography,
} from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import UnstyledCloseIcon from "@material-ui/icons/Close";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import UnstyledMenuIcon from "@material-ui/icons/Menu";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PetsIcon from "@material-ui/icons/Pets";
import StoreIcon from "@material-ui/icons/Store";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DemoPath, SongPath } from "../common/paths";
import LoadSongDialog from "./LoadSongDialog";
import { allExerciseRoutes, ExerciseRoute } from "./Tutorial";
import Login from "./user/Login";
import { SetUserContext, UserContext } from "./user/userContext";

const withPointerStyle = withStyles({
    root: {
        cursor: "pointer",
    },
});

const MenuIcon = withPointerStyle(UnstyledMenuIcon);
const CloseIcon = withPointerStyle(UnstyledCloseIcon);

const Drawer = withStyles({
    root: {
        display: "flex",
        flexDirection: "column",
    },
})(UnstyledDrawer);

const VerticalGridItem = withStyles({
    root: {
        maxWidth: "none",
    },
})(Grid);

const TitleGrid = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
    },
}))(Grid);

const TitleName = withStyles({
    root: {
        color: grey[600],
    },
})(Typography);

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

const useFillerStyle = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const SideMenu: React.FC<{}> = (): JSX.Element => {
    const user = React.useContext(UserContext);
    const onUserChanged = React.useContext(SetUserContext);

    const [expanded, setExpanded] = useState(false);
    const [showLoadSongsDialog, setShowLoadSongsDialog] = useState(false);

    const [learnSubmenuOpen, setLearnSubMenuOpen] = useState(false);
    const fillerStyle = useFillerStyle();

    const typographyProps = {
        variant: "h6" as "h6",
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

    const linkStyle = {
        textDecoration: "none",
        color: "inherit",
    };

    const collapsedMenu = (
        <Drawer variant="persistent" open={!expanded} anchor="left">
            <CollapsedMenuSurface>
                <FullHeightGrid
                    container
                    direction="column"
                    alignContent="center"
                >
                    <VerticalGridItem item xs={1}></VerticalGridItem>
                    <VerticalGridItem item xs={1}>
                        <MenuIcon onClick={() => setExpanded(true)} />
                    </VerticalGridItem>
                    <VerticalGridItem item xs={10}></VerticalGridItem>
                </FullHeightGrid>
            </CollapsedMenuSurface>
        </Drawer>
    );

    const expandedMenu = (
        <Drawer variant="persistent" open={expanded} anchor="left">
            <TitleGrid container alignItems="center" justify="space-between">
                <Grid item>
                    <Link
                        to="/"
                        style={linkStyle}
                        data-testid="Menu-TitleButton"
                    >
                        <TitleName variant="h5" display="inline">
                            Chord Paper
                        </TitleName>
                    </Link>
                </Grid>
                <Grid item>
                    <CloseIcon onClick={() => setExpanded(false)} />
                </Grid>
            </TitleGrid>

            <Divider />
            <List>
                <Link
                    key={SongPath.rootURL()}
                    to={SongPath.rootURL()}
                    style={linkStyle}
                    data-testid="Menu-HomeButton"
                >
                    <ListItem key="New Song" button>
                        <ListItemIcon>
                            <MusicNoteIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="New Song"
                            primaryTypographyProps={typographyProps}
                        />
                    </ListItem>
                </Link>
                {user !== null && (
                    <ListItem
                        key="Load Song"
                        button
                        onClick={(event: unknown) =>
                            setShowLoadSongsDialog(true)
                        }
                    >
                        <ListItemIcon>
                            <LibraryMusicIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Load Song"
                            primaryTypographyProps={typographyProps}
                        />
                    </ListItem>
                )}
                <Link
                    key={DemoPath.rootURL()}
                    to={DemoPath.rootURL()}
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
            <div className={fillerStyle.root} />
            <Login onUserChanged={onUserChanged} />
        </Drawer>
    );

    return (
        <>
            {collapsedMenu}
            {expandedMenu}
            {showLoadSongsDialog && (
                <LoadSongDialog
                    open
                    onClose={() => setShowLoadSongsDialog(false)}
                />
            )}
        </>
    );
};

export default SideMenu;
