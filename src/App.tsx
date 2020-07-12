import {
    createMuiTheme,
    Grid,
    PaletteColorOptions,
    Theme,
    ThemeProvider,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { SnackbarProvider as UnstyledSnackbarProvider } from "notistack";
import React from "react";
import {
    HashRouter,
    Redirect,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import WoodBackground from "./assets/img/symphony.png";
import About from "./components/about/About";
import AutoSaveSong from "./components/AutoSaveSong";
import SideMenu from "./components/SideMenu";
import Song from "./components/Song";
import { TutorialSwitches } from "./components/Tutorial";
import Version from "./components/Version";
import { NeverGonnaGiveYouUp } from "./NeverGonnaGiveYouUp";

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

    const green: PaletteColorOptions = {
        main: "#00c853",
        light: "#5efc82",
        dark: "#009624",
        contrastText: "#000000",
    };

    return createMuiTheme({
        palette: {
            primary: lightBlue,
            secondary: purple,
            success: green,
        },
        typography: {
            fontFamily: "Merriweather",
            fontWeightRegular: 300,
        },
    });
};

const theme: Theme = createTheme();

const SnackbarProvider = withStyles((theme: Theme) => ({
    variantSuccess: {
        backgroundColor: theme.palette.success.main,
    },
}))(UnstyledSnackbarProvider);

const AppLayout = withStyles({
    root: {
        backgroundImage: `url(${WoodBackground})`,
        minHeight: "100vh",
    },
})(Grid);

const shouldShowMenu = (path: string): boolean => {
    return !["/song/play", "/demo/play"].includes(path);
};

const AppContent: React.FC<{}> = () => {
    const location = useLocation();

    const routes = (
        <Switch>
            <Redirect from="/" to="/song" exact />

            <Redirect from="/song" to="/song/edit" exact />
            <Route key="/song" path="/song">
                <AutoSaveSong basePath="/song" />
            </Route>

            <Redirect from="/demo" to="/demo/edit" exact />
            <Route key="/demo" path="/demo">
                <Song basePath="/demo" initialSong={NeverGonnaGiveYouUp()} />
            </Route>

            {TutorialSwitches()}
            <Route key="/about" exact path="/about">
                <About />
            </Route>
            <Redirect to="/" />
        </Switch>
    );

    return (
        <>
            {shouldShowMenu(location.pathname) && <SideMenu />}
            <AppLayout container>
                <Grid item container justify="center">
                    {routes}
                </Grid>
            </AppLayout>
            <Version />
        </>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <HashRouter>
                    <AppContent />;
                </HashRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
