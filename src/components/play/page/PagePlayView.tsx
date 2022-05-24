import { createTheme, Theme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from "@mui/material";
import React, { useState } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import PagePlayContent, { PageDisplaySettings } from "./PagePlayContent";
import PagePlayMenu from "./PagePlayMenu";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


interface PagePlayViewProps {
    song: ChordSong;
    onScrollView?: PlainFn;
    onEditMode?: PlainFn;
}

const PagePlayView: React.FC<PagePlayViewProps> = (props: PagePlayViewProps): JSX.Element => {
    const [displaySettings, setDisplaySettings] = useState<PageDisplaySettings>({
        numberOfColumnsPerPage: 2,
        fontSize: 14,
        columnMargin: 20,
        flipType: "column",
    });

    const playTheme = (theme: Theme): Theme => {
        return createTheme(adaptV4Theme({
            ...theme,
            typography: {
                fontFamily: theme.typography.fontFamily,
                fontWeightRegular: theme.typography.fontWeightRegular,
                fontSize: displaySettings.fontSize,
            },
        }));
    };

    return <>
        <PagePlayMenu
            displaySettings={displaySettings}
            onDisplaySettingsChange={setDisplaySettings}
            onScrollView={props.onScrollView}
            onExit={props.onEditMode}
        />
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={playTheme}>
                <PagePlayContent
                    song={props.song}
                    displaySettings={displaySettings}
                />
            </ThemeProvider>
        </StyledEngineProvider>
    </>;
};

export default PagePlayView;
