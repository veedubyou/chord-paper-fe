import {
    createMuiTheme,
    Grid,
    PaletteColorOptions,
    Theme,
    ThemeProvider,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { SnackbarProvider as UnstyledSnackbarProvider } from "notistack";
import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
    HashRouter,
    Redirect,
    Route,
    Switch,
    useLocation,
} from "react-router-dom";
import Background from "./assets/img/symphony.png";
import { ChordSong } from "./common/ChordModel/ChordSong";
import About from "./components/about/About";
import Demo from "./components/Demo";
import {
    aboutPath,
    DemoModePath,
    demoPath,
    newSongPath,
    rootPath,
    SongIDModePath,
    songPath,
} from "./common/paths";

import SideMenu from "./components/SideMenu";
import SongFetcher from "./components/SongFetcher";
import SongRouter from "./components/SongRouter";
import { TutorialSwitches } from "./components/Tutorial";
import { User, UserContext } from "./components/user/userContext";
import Version from "./components/Version";
import { withSongContext } from "./components/WithSongContext";
import { withCloud } from "./components/WithCloud";

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
        backgroundImage: `url(${Background})`,
        minHeight: "100vh",
    },
})(Grid);

const MainSong = withSongContext(withCloud(SongRouter));

const AppContent: React.FC<{}> = (): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);

    const handleUserChanged = (newUser: User) => setUser(newUser);

    const location = useLocation();
    const loadSongPath = songPath.withID(":id");

    const isFullScreen =
        SongIDModePath.isPlayMode(location.pathname) ||
        DemoModePath.isPlayMode(location.pathname);

    const routes = (
        <Switch>
            <Redirect from={rootPath.URL()} to={newSongPath.URL()} exact />

            <Route key={newSongPath.URL()} path={newSongPath.URL()}>
                <MainSong song={new ChordSong()} path={newSongPath} />
            </Route>

            <Route key={loadSongPath.URL()} path={loadSongPath.URL()}>
                <SongFetcher>
                    {(song: ChordSong) => (
                        <MainSong
                            song={song}
                            path={loadSongPath.parent().withID(song.id)}
                        />
                    )}
                </SongFetcher>
            </Route>

            <Route key={demoPath.URL()} path={demoPath.URL()}>
                <Demo />
            </Route>

            {TutorialSwitches()}
            <Route key={aboutPath.URL()} path={aboutPath.URL()} exact>
                <About />
            </Route>
            <Redirect to={rootPath.URL()} />
        </Switch>
    );

    return (
        <UserContext.Provider value={user}>
            {!isFullScreen && <SideMenu onUserChanged={handleUserChanged} />}
            <AppLayout container>
                <Grid item container justify="center">
                    {routes}
                </Grid>
            </AppLayout>
            <Version />
        </UserContext.Provider>
    );
};

function App() {
    return (
        <HelmetProvider>
            <ThemeProvider theme={theme}>
                <Helmet
                    titleTemplate="%s - Chord Paper"
                    defaultTitle="Chord Paper"
                />
                <SnackbarProvider>
                    <HashRouter>
                        <AppContent />
                    </HashRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
