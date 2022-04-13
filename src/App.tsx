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
import {
    aboutPath,
    guitarDemoPath,
    newSongPath,
    rootPath,
    SongIDModePath,
    songPath,
} from "./common/paths";
import About from "./components/about/About";
import DragAndDrop from "./components/edit/DragAndDrop";
import GlobalKeyListenerProvider from "./components/GlobalKeyListener";
import GuitarDemo from "./components/guitar/GuitarDemo";
import SideMenu from "./components/SideMenu";
import SongFetcher from "./components/SongFetcher";
import SongRouter from "./components/SongRouter";
import { TutorialSwitches } from "./components/Tutorial";
import { User, UserContext } from "./components/user/userContext";
import Version from "./components/Version";
import { withCloudSaveSongContext } from "./components/WithSongContext";

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

const withBackground = withStyles({
    root: {
        backgroundImage: `url(${Background})`,
        minHeight: "100vh",
    },
});

const AppLayout = withBackground(Grid);

const MainSong = withCloudSaveSongContext(SongRouter);

const AppContent: React.FC<{}> = (): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);

    const handleUserChanged = (newUser: User) => setUser(newUser);

    const location = useLocation();
    const loadSongPath = songPath.withID(":id");

    const withLayout = (
        child: React.ReactElement | React.ReactElement[]
    ): React.ReactElement => {
        if (SongIDModePath.isPlayMode(location.pathname)) {
            // no background required on full screen play mode
            // more importantly, don't set the min-height
            return (
                <Grid container>
                    <Grid item container justify="center">
                        {child}
                    </Grid>
                </Grid>
            );
        }

        return (
            <>
                <SideMenu onUserChanged={handleUserChanged} />
                <AppLayout container>
                    <Grid item container justify="center">
                        {child}
                    </Grid>
                </AppLayout>
                <Version />
            </>
        );
    };

    const routes = (
        <Switch>
            <Redirect from={rootPath.URL()} to={newSongPath.URL()} exact />

            <Route key={newSongPath.URL()} path={newSongPath.URL()}>
                {withLayout(
                    <MainSong song={new ChordSong({})} path={newSongPath} />
                )}
            </Route>

            <Route key={loadSongPath.URL()} path={loadSongPath.URL()}>
                {withLayout(
                    <SongFetcher>
                        {(song: ChordSong) => (
                            <MainSong
                                song={song}
                                path={loadSongPath.parent().withID(song.id)}
                            />
                        )}
                    </SongFetcher>
                )}
            </Route>

            {TutorialSwitches(withLayout)}
            <Route key={aboutPath.URL()} path={aboutPath.URL()} exact>
                {withLayout(<About />)}
            </Route>
            <Route key={guitarDemoPath.URL()} path={guitarDemoPath.URL()} exact>
                <GuitarDemo />
            </Route>
            <Redirect to={rootPath.URL()} />
        </Switch>
    );

    return <UserContext.Provider value={user}>{routes}</UserContext.Provider>;
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
                        <DragAndDrop>
                            <GlobalKeyListenerProvider>
                                <AppContent />
                            </GlobalKeyListenerProvider>
                        </DragAndDrop>
                    </HashRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
