import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { TrackList } from "../../common/ChordModel/tracks/TrackList";
import { PlainFn } from "../../common/PlainFn";
import TrackListProvider from "../track_player/TrackListProvider";
import JamStation from "../track_player/JamStation";
import PlayContent, { DisplaySettings } from "./PlayContent";
import PlayMenu from "./PlayMenu";

const useTransparentStyle = makeStyles({
    root: {
        backgroundColor: "transparent",
    },
});

interface PlayProps {
    song: ChordSong;
    onEdit?: PlainFn;
}

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
        numberOfColumnsPerPage: 2,
        fontSize: 14,
        columnMargin: 20,
        scrollType: "page",
    });

    const transparentStyle = useTransparentStyle();

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

    const trackPlayer: React.ReactNode = (() => {
        if (props.song.isUnsaved()) {
            return null;
        }

        return (
            <TrackListProvider song={props.song}>
                {(tracklist: TrackList) => (
                    <JamStation
                        collapsedButtonClassName={transparentStyle.root}
                        timeSections={props.song.timeSections}
                        trackList={tracklist}
                    />
                )}
            </TrackListProvider>
        );
    })();

    return (
        <>
            <Helmet>
                <title>
                    {props.song.metadata.title !== ""
                        ? props.song.metadata.title
                        : "New Song"}
                </title>
            </Helmet>
            <PlayMenu
                displaySettings={displaySettings}
                onDisplaySettingsChange={setDisplaySettings}
                onExit={props.onEdit}
            />
            <ThemeProvider theme={playTheme}>
                <PlayContent
                    song={props.song}
                    displaySettings={displaySettings}
                />
            </ThemeProvider>
            {trackPlayer}
        </>
    );
};

export default Play;
