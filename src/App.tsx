import React from "react";
import {
    Theme,
    ThemeProvider,
    createMuiTheme,
    PaletteColorOptions,
    Grid,
} from "@material-ui/core";
import ChordPaper from "./components/ChordPaper";
import { SnackbarProvider } from "notistack";
import { NeverGonnaGiveYouUp } from "./NeverGonnaGiveYouUp";
import { withStyles } from "@material-ui/styles";
import WoodBackground from "./assets/img/wood.png";

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
            fontFamily: `"Merriweather", serif`,
            fontWeightRegular: 300,
        },
    });
};

const AppLayout = withStyles({
    root: {
        backgroundImage: `url(${WoodBackground})`,
    },
})(Grid);

function App() {
    const theme: Theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <AppLayout container justify="center">
                    <Grid item>
                        <ChordPaper initialSong={NeverGonnaGiveYouUp()} />
                    </Grid>
                </AppLayout>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
