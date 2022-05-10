import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import PagePlayContent, { PageDisplaySettings } from "./PagePlayContent";
import PagePlayMenu from "./PagePlayMenu";

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
        return createMuiTheme({
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