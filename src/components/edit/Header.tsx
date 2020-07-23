import { Box, Grid, Theme, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import EditableTypography from "./EditableTypography";

interface HeaderProps {
    song: ChordSong;
    onSongChanged?: (updatedSong: ChordSong) => void;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps): JSX.Element => {
    const theme: Theme = useTheme();

    const notifySongChanged = (): void => {
        if (props.onSongChanged) {
            props.onSongChanged(props.song);
        }
    };

    const updateTitleHandler = (newTitle: string) => {
        props.song.title = newTitle;
        notifySongChanged();
    };

    const updateComposeHandler = (newComposer: string) => {
        props.song.composedBy = newComposer;
        notifySongChanged();
    };

    const updatePerformerHandler = (newPerformer: string) => {
        props.song.performedBy = newPerformer;
        notifySongChanged();
    };

    const updateHeardFrom = (newHeardFrom: string) => {
        props.song.asHeardFrom = newHeardFrom;
        notifySongChanged();
    };

    const title = (
        <Box paddingBottom={theme.spacing(0.5)}>
            <EditableTypography
                variant="h4"
                align="center"
                data-testid="SongTitle"
                placeholder="Song Title"
                onValueChange={updateTitleHandler}
            >
                {props.song.title}
            </EditableTypography>
        </Box>
    );

    const details = (
        <Grid container justify="center">
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="block" variant="caption">
                        Composed by:{" "}
                    </Typography>

                    <EditableTypography
                        display="block"
                        variant="caption"
                        placeholder="Stock Aitken Waterman"
                        onValueChange={updateComposeHandler}
                        data-testid="ComposedBy"
                    >
                        {props.song.composedBy}
                    </EditableTypography>
                </Grid>
            </Grid>
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="inline" variant="caption">
                        Performed by:{" "}
                    </Typography>

                    <EditableTypography
                        variant="caption"
                        placeholder="Rick Astley"
                        onValueChange={updatePerformerHandler}
                        data-testid="PerformedBy"
                    >
                        {props.song.performedBy}
                    </EditableTypography>
                </Grid>
            </Grid>
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="inline" variant="caption">
                        As heard from:{" "}
                    </Typography>
                    <EditableTypography
                        variant="caption"
                        placeholder="https://www.youtube.com/watch?v=dM9zwZCOmjM"
                        onValueChange={updateHeardFrom}
                        data-testid="AsHeardAt"
                    >
                        {props.song.asHeardFrom}
                    </EditableTypography>
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <Box
            paddingTop={theme.spacing(1)}
            paddingLeft={theme.spacing(0.5)}
            paddingRight={theme.spacing(0.5)}
            data-testid="Header"
        >
            {title}
            {details}
        </Box>
    );
};

export default Header;
