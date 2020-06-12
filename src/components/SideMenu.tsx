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
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PetsIcon from "@material-ui/icons/Pets";
import FreeBreakfastIcon from "@material-ui/icons/FreeBreakfast";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { withStyles } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";
import { allExerciseRoutes, ExerciseRoute } from "./tutorial/Tutorial";

const TitleName = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
        color: grey[600],
    },
}))(Typography);

const SideMenu: React.FC<{}> = (): JSX.Element => {
    const [learnSubmenuOpen, setLearnSubMenuOpen] = useState(false);

    const typographyProps = {
        variant: "h6" as "h6",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "inherit",
    };

    const learnClickHandler = () => {
        setLearnSubMenuOpen(!learnSubmenuOpen);
    };

    const tutorialMenu = () => {
        const exerciseLinks = allExerciseRoutes().map(
            (exerciseRoute: ExerciseRoute) => {
                return (
                    <Link to={exerciseRoute.route} style={linkStyle}>
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
        <Drawer variant="permanent" anchor="left">
            <Link to="/" style={linkStyle} data-testid="Menu-TitleButton">
                <TitleName variant="h5">Chord Paper</TitleName>
            </Link>
            <Divider />
            <List>
                <Link to="/" style={linkStyle} data-testid="Menu-HomeButton">
                    <ListItem key="Music" button>
                        <ListItemIcon>
                            <MusicNoteIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Music"
                            primaryTypographyProps={typographyProps}
                        />
                    </ListItem>
                </Link>
                {tutorialMenu()}
                <Link
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
    );
};

export default SideMenu;
