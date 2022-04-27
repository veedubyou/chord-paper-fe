import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import React from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import ScrollPlayContent from "./ScrollPlayContent";
import ScrollPlayMenu from "./ScrollPlayMenu";

interface ScrollPlayViewProps {
    song: ChordSong;
    onPageView?: PlainFn;
    onEditMode?: PlainFn;
}

const ScrollPlayView: React.FC<ScrollPlayViewProps> = (props: ScrollPlayViewProps): JSX.Element => {
    const playTheme = (theme: Theme): Theme => {
        return createMuiTheme({
            ...theme,
            typography: {
                fontFamily: theme.typography.fontFamily,
                fontWeightRegular: theme.typography.fontWeightRegular,
                // fontSize: displaySettings.fontSize,
            },
        });
    };

    return (
        <>
            <ScrollPlayMenu
                onPageView={props.onPageView}
                onExit={props.onEditMode}
            />
            <ThemeProvider theme={playTheme}>
                <ScrollPlayContent
                    song={props.song}
                />
            </ThemeProvider>
        </>
    );
};

export default ScrollPlayView;
