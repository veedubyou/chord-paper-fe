import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { ChordSong } from "common/ChordModel/ChordSong";
import { PlainFn } from "common/PlainFn";
import PagePlayContent, { PageDisplaySettings } from "components/play/page/PagePlayContent";
import PagePlayMenu from "components/play/page/PagePlayMenu";
import React, { useState } from "react";

interface PagePlayViewProps {
    song: ChordSong;
    onScrollView?: PlainFn;
    onEditMode?: PlainFn;
}

const PagePlayView: React.FC<PagePlayViewProps> = (
    props: PagePlayViewProps
): JSX.Element => {
    const [displaySettings, setDisplaySettings] = useState<PageDisplaySettings>(
        {
            numberOfColumnsPerPage: 2,
            fontSize: 14,
            columnMargin: 20,
            flipType: "column",
        }
    );

    const playTheme = (theme: Theme): Theme => {
        return createTheme({
            ...theme,
            typography: {
                fontFamily: theme.typography.fontFamily,
                fontWeightRegular: theme.typography.fontWeightRegular,
                fontSize: displaySettings.fontSize,
            },
        });
    };

    return (
        <>
            <PagePlayMenu
                displaySettings={displaySettings}
                onDisplaySettingsChange={setDisplaySettings}
                onScrollView={props.onScrollView}
                onExit={props.onEditMode}
            />
            <ThemeProvider theme={playTheme}>
                <PagePlayContent
                    song={props.song}
                    displaySettings={displaySettings}
                />
            </ThemeProvider>
        </>
    );
};

export default PagePlayView;
