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
            fontFamily: "Playfair",
            fontWeightRegular: 500,
        },
    });
};

function App() {
    const theme: Theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <Grid container justify="center">
                    <Grid item>
                        <ChordPaper initialSong={NeverGonnaGiveYouUp()} />
                    </Grid>
                </Grid>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
