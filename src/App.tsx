import React from "react";
import {
    Theme,
    ThemeProvider,
    createMuiTheme,
    PaletteColorOptions,
    Grid,
} from "@material-ui/core";
import ChordPaper from "./components/edit/ChordPaper";
import { SnackbarProvider } from "notistack";
import { NeverGonnaGiveYouUp } from "./NeverGonnaGiveYouUp";
import { withStyles } from "@material-ui/styles";
import WoodBackground from "./assets/img/symphony.png";
import SideMenu from "./components/SideMenu";
import { HashRouter, Switch, Route } from "react-router-dom";
import About from "./components/about/About";
import { TutorialSwitches } from "./components/Tutorial";
import Version from "./components/Version";
import { ChordSong } from "./common/ChordModel/ChordSong";

const createTheme = (): Theme => {
    const lightBlue: PaletteColorOptions = {
        main: "#4fc3f7",
        light: "#8bf6ff",
        dark: "#0093c4",
        contrastText: "#000000",
    };

    const purple: PaletteColorOptions = {
        main: "#844ffc",
        light: "#bb7eff",
        dark: "#4a1fc8",
        contrastText: "#ffffff",
    };

    return createMuiTheme({
        palette: {
            primary: lightBlue,
            secondary: purple,
        },
        typography: {
            fontFamily: "Merriweather",
            fontWeightRegular: 300,
        },
    });
};

const AppLayout = withStyles({
    root: {
        backgroundImage: `url(${WoodBackground})`,
        minHeight: "100vh",
    },
})(Grid);

function App() {
    const theme: Theme = createTheme();

    const routeSwitches = (
        <Switch>
            <Route key="/" exact path="/">
                <ChordPaper initialSong={new ChordSong()} />
            </Route>
            <Route key="/demo" exact path="/demo">
                <ChordPaper initialSong={NeverGonnaGiveYouUp()} />
            </Route>
            {TutorialSwitches()}
            <Route key="/about" exact path="/about">
                <About />
            </Route>
        </Switch>
    );

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <HashRouter>
                    <SideMenu />
                    <AppLayout container>
                        <Grid item container justify="center">
                            {routeSwitches}
                        </Grid>
                    </AppLayout>
                    <Version />
                </HashRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
