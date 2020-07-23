import { createMuiTheme, Theme, ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { PlainFn } from "../../common/PlainFn";
import PlayContent, { PlayFormatting } from "./PlayContent";
import PlayMenu from "./PlayMenu";

interface PlayProps {
    song: ChordSong;
    onEdit?: PlainFn;
}

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const [formatting, setFormatting] = useState<PlayFormatting>({
        numberOfColumns: 2,
        fontSize: 14,
        columnMargin: 20,
    });

    const playTheme = (theme: Theme): Theme => {
        return createMuiTheme({
            ...theme,
            typography: {
                fontFamily: theme.typography.fontFamily,
                fontWeightRegular: theme.typography.fontWeightRegular,
                fontSize: formatting.fontSize,
            },
        });
    };

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
                formatting={formatting}
                onFormattingChange={setFormatting}
                onExit={props.onEdit}
            />
            <ThemeProvider theme={playTheme}>
                <PlayContent song={props.song} formatting={formatting} />
            </ThemeProvider>
        </>
    );
};

export default Play;
