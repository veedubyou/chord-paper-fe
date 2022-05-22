import UnstyledCloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import UnstyledMenuIcon from "@mui/icons-material/Menu";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PetsIcon from "@mui/icons-material/Pets";
import StoreIcon from "@mui/icons-material/Store";
import {
    Box,
    Collapse,
    Divider,
    Drawer as UnstyledDrawer,
    Grid, List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
    Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DemoPath, SongPath } from "../common/paths";
import { PlainFn } from "../common/PlainFn";
import LoadSongDialog from "./LoadSongDialog";
import { allExerciseRoutes, ExerciseRoute } from "./Tutorial";
import Login from "./user/Login";
import { SetUserContext, UserContext } from "./user/userContext";

const pointerStyle = {
    cursor: "pointer",
};

const MenuIcon = styled(UnstyledMenuIcon)(pointerStyle);
const CloseIcon = styled(UnstyledCloseIcon)(pointerStyle);

const Drawer = styled(UnstyledDrawer)({
    display: "flex",
    flexDirection: "column",
});

const VerticalGridItem = styled(Grid)({
    maxWidth: "none",
});

interface CollapsedSideMenuProps {
    open: boolean;
    onClick?: PlainFn;
}

export const CollapsedSideMenu: React.FC<CollapsedSideMenuProps> = (
    props: CollapsedSideMenuProps
): JSX.Element => {
    return (
        <Drawer variant="persistent" open={props.open} anchor="left">
            <Paper
                sx={{
                    minWidth: "24px",
                    height: "100vh",
                }}
            >
                <Grid
                    container
                    direction="column"
                    alignContent="center"
                    sx={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <VerticalGridItem item xs={1}></VerticalGridItem>
                    <VerticalGridItem item xs={1}>
                        <MenuIcon onClick={props.onClick} />
                    </VerticalGridItem>
                    <VerticalGridItem item xs={10}></VerticalGridItem>
                </Grid>
            </Paper>
        </Drawer>
    );
};

const SideMenu: React.FC<{}> = (): JSX.Element => {
    const user = React.useContext(UserContext);
    const onUserChanged = React.useContext(SetUserContext);

    const [expanded, setExpanded] = useState(false);
    const [showLoadSongsDialog, setShowLoadSongsDialog] = useState(false);

    const [learnSubmenuOpen, setLearnSubMenuOpen] = useState(false);

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

    const fillerBox = <Box sx={{ flexGrow: 1 }} />;

    const collapsedMenu = (
        <CollapsedSideMenu open={!expanded} onClick={() => setExpanded(true)} />
    );

    const expandedMenu = (
        <Drawer variant="persistent" open={expanded} anchor="left">
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: 3 }}
            >
                <Grid item>
                    <Link
                        to="/"
                        style={linkStyle}
                        data-testid="Menu-TitleButton"
                    >
                        <Typography
                            variant="h5"
                            display="inline"
                            sx={{ color: grey[600] }}
                        >
                            Chord Paper
                        </Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <CloseIcon onClick={() => setExpanded(false)} />
                </Grid>
            </Grid>

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
            {fillerBox}
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
