import React from "react";
import {
    Drawer,
    Divider,
    List,
    ListItem as UnstyledListItem,
    ListItemText,
    Typography,
    Theme,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import PetsIcon from "@material-ui/icons/Pets";
import { withStyles, useTheme } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";

const TitleName = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3),
        color: grey[600],
    },
}))(Typography);

const ListItem = withStyles((theme: Theme) => ({
    root: {
        paddingLeft: theme.spacing(3),
    },
}))(UnstyledListItem);

const SideMenu = () => {
    const theme: Theme = useTheme();
    const typographyProps = {
        variant: "h6" as "h6",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "inherit",
    };

    return (
        <Drawer variant="permanent" anchor="left">
            <TitleName variant="h5">Chord Paper</TitleName>
            <Divider />
            <List>
                <Link to="/" style={linkStyle} data-testid="Menu-HomeButton">
                    <ListItem key="Music" button>
                        <MusicNoteIcon />
                        <ListItemText
                            primary="Music"
                            primaryTypographyProps={typographyProps}
                        />
                    </ListItem>
                </Link>

                <Link
                    to="/about"
                    style={linkStyle}
                    data-testid="Menu-AboutButton"
                >
                    <ListItem key="About" button>
                        <PetsIcon />
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
