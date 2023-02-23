import { css, cx } from "@emotion/css";
import {
    createTheme as createMuiTheme,
    PaletteColorOptions,
    Theme,
    ThemeProvider
} from "@mui/material";
import { ChordSong } from "common/ChordModel/ChordSong";
import {
    AboutPath,
    GuitarDemoPath,
    RootPath,
    SongPath,
    TutorialPath
} from "common/paths";
import AboutScreen from "components/about/About";
import OneTimeMobileNotification from "components/display/OneTimeMobileNotification";
import DragAndDrop from "components/edit/DragAndDrop";
import GlobalKeyListenerProvider from "components/GlobalKeyListener";
import GuitarDemo from "components/guitar/GuitarDemo";
import SongFetcher from "components/SongFetcher";
import SongRouter from "components/SongRouter";
import TutorialRoutes from "components/Tutorial";
import {
    SetUserContext,
    User,
    UserContext
} from "components/user/userContext";
import { withCloudSaveSongContext } from "components/WithSongContext";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

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

const createTheme = (): Theme => {
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
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        // overriding button styles
                        // to resemble MUI 4 aesthetics
                        color: "black",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)"
                        },
                    },
                },
            },
        },
    });
};

const theme: Theme = createTheme();

const snackbarSuccessClassName = cx(css({ backgroundColor: green.main }));

const MainSong = withCloudSaveSongContext(SongRouter);

const AppContent: React.FC<{}> = (): JSX.Element => {
    const [user, setUser] = useState<User | null>(null);
    const handleUserChanged = (newUser: User | null) => setUser(newUser);

    const loadSongPath = SongPath.root.withID(":id");

    const routes = (
        <Switch>
            <Redirect from={RootPath.rootURL()} to={SongPath.newURL()} exact />

            <Route key={SongPath.newURL()} path={SongPath.newURL()}>
                <MainSong
                    song={new ChordSong({})}
                    path={SongPath.root.withNew()}
                />
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

            <Route key={TutorialPath.rootURL()} path={TutorialPath.rootURL()}>
                <TutorialRoutes />
            </Route>

            <Route key={AboutPath.rootURL()} path={AboutPath.rootURL()} exact>
                <AboutScreen />
            </Route>

            <Route
                key={GuitarDemoPath.rootURL()}
                path={GuitarDemoPath.rootURL()}
                exact
            >
                <GuitarDemo />
            </Route>

            <Redirect to={RootPath.rootURL()} />
        </Switch>
    );

    return (
        <UserContext.Provider value={user}>
            <SetUserContext.Provider value={handleUserChanged}>
                {routes}
            </SetUserContext.Provider>
        </UserContext.Provider>
    );
};

const App: React.FC<{}> = (): JSX.Element => {
    return (
        <HelmetProvider>
            <ThemeProvider theme={theme}>
                <Helmet
                    titleTemplate="%s - Chord Paper"
                    defaultTitle="Chord Paper"
                />
                <SnackbarProvider
                    classes={{ variantSuccess: snackbarSuccessClassName }}
                >
                    <HashRouter>
                        <DragAndDrop>
                            <GlobalKeyListenerProvider>
                                <AppContent />
                                <OneTimeMobileNotification />
                            </GlobalKeyListenerProvider>
                        </DragAndDrop>
                    </HashRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </HelmetProvider>
    );
};

export default App;
