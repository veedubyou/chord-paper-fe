import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { PlainFn } from "../../common/PlainFn";
import { isValidUrl } from "../../common/URL";
import PlayContent, { DisplaySettings } from "./PlayContent";
import { PlayerSettings } from "./PlayerSettingsDialog";
import PlayMenu from "./PlayMenu";
import SongPlayer from "./SongPlayer";

interface PlayProps {
    song: ChordSong;
    onEdit?: PlainFn;
}

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
        numberOfColumns: 2,
        fontSize: 14,
        columnMargin: 20,
    });

    const defaultURL = isValidUrl(props.song.asHeardFrom)
        ? props.song.asHeardFrom
        : "";

    const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
        enablePlayer: true,
        url: defaultURL,
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

    const playerHeightPercentage = playerSettings.enablePlayer ? 10 : 0;
    const contentHeightPercentage = 100 - playerHeightPercentage;

    const playerHeight = `${playerHeightPercentage}vh`;
    const contentHeight = `${contentHeightPercentage}vh`;

    const player: React.ReactNode = (() => {
        if (!playerSettings.enablePlayer) {
            return null;
        }

        return <SongPlayer url={playerSettings.url} height={playerHeight} />;
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
                playerSettings={playerSettings}
                onDisplaySettingsChange={setDisplaySettings}
                onPlayerSettingsChange={setPlayerSettings}
                onExit={props.onEdit}
            />
            <ThemeProvider theme={playTheme}>
                <PlayContent
                    song={props.song}
                    displaySettings={displaySettings}
                    height={contentHeight}
                />
            </ThemeProvider>
            {player}
        </>
    );
};

export default Play;
