import React from "react";
import {
    Paper,
    Theme,
    withStyles,
    ThemeProvider,
    createMuiTheme,
    PaletteColorOptions,
} from "@material-ui/core";
import ChordPaper from "./components/ChordPaper";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        minHeight: "750px",
        width: "max-content",
    },
}))(Paper);

const lorumIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus turpis massa tincidunt dui ut ornare. Tempus urna et pharetra pharetra massa massa ultricies mi quis. Neque volutpat ac tincidunt vitae semper quis lectus nulla. Faucibus in ornare quam viverra orci sagittis eu. Sed augue lacus viverra vitae. Nisl condimentum id venenatis a. Praesent tristique magna sit amet purus gravida quis blandit turpis. Eget magna fermentum iaculis eu non diam. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt.";

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
    });
};

function App() {
    const theme: Theme = createTheme();

    let sentences = lorumIpsum.split(".");

    return (
        <ThemeProvider theme={theme}>
            <RootPaper elevation={3}>
                <ChordPaper initialLyrics={sentences}></ChordPaper>
            </RootPaper>
        </ThemeProvider>
    );


export default App;
