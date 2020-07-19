import {
    createMuiTheme,
    responsiveFontSizes,
    Theme,
    ThemeProvider,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { pageTitle } from "../display/PageTitle";
import PlayContent, { PlayFormatting } from "./PlayContent";
import PlayMenu from "./PlayMenu";

interface PlayProps {
    song: ChordSong;
    onEdit?: () => void;
}

const defaultFontSize = 20;

const fontSizeToPx = (fontSize: string | number): number => {
    if (typeof fontSize === "number") {
        return fontSize;
    }

    if (!fontSize.includes("rem")) {
        return defaultFontSize;
    }
    const remTokens: string[] = fontSize.split("rem");

    const remSize: number = Number(remTokens[0]);
    if (isNaN(remSize)) {
        return defaultFontSize;
    }

    const htmlFontSize = 16;

    return remSize * htmlFontSize;
};

const Play: React.FC<PlayProps> = (props: PlayProps): JSX.Element => {
    const theme: Theme = useTheme();
    const [formatting, setFormatting] = useState<PlayFormatting>({
        numberOfColumns: 2,
        fontSize: fontSizeToPx(theme.typography.h6.fontSize ?? defaultFontSize),
        columnMargin: 20,
    });

    const playTheme = (theme: Theme): Theme => {
        return responsiveFontSizes(
            createMuiTheme({
                ...theme,
                typography: {
                    ...theme.typography,
                    h6: {
                        fontSize: formatting.fontSize,
                    },
                },
            })
        );
    };

    return (
        <>
            <Helmet>
                <title>{pageTitle(props.song)}</title>
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
