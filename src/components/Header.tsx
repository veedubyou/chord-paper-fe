import React from "react";
import { Typography, Theme, Grid, Box } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import EditableTypography from "./EditableTypography";
import { ChordSong } from "../common/ChordModel";

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

    const updateHeardAt = (newHeardAt: string) => {
        props.song.asHeardAt = newHeardAt;
        notifySongChanged();
    };

    const leftHeader = (
        <Grid item xs={3} direction="column">
            <Grid item>
                <Typography display="inline" variant="caption">
                    As Heard At:{" "}
                </Typography>
                <EditableTypography
                    variant="caption"
                    placeholder="https://www.youtube.com/watch?v=dM9zwZCOmjM"
                    onValueChange={updateHeardAt}
                    data-testid="AsHeardAt"
                >
                    {props.song.asHeardAt}
                </EditableTypography>
            </Grid>
        </Grid>
    );

    const midHeader = (
        <Grid item xs={6}>
            <EditableTypography
                variant="h4"
                align="center"
                data-testid="SongTitle"
                placeholder="Song Title"
                onValueChange={updateTitleHandler}
            >
                {props.song.title}
            </EditableTypography>
        </Grid>
    );

    const rightHeader = (
        <Grid item container xs={3} direction="column">
            <Grid item>
                <Box alignContent=""></Box>
                <Typography display="inline" variant="subtitle2">
                    Composed By:{" "}
                </Typography>

                <EditableTypography
                    variant="subtitle2"
                    placeholder="Stock Waterman"
                    onValueChange={updateComposeHandler}
                    data-testid="ComposedBy"
                >
                    {props.song.composedBy}
                </EditableTypography>
            </Grid>
            <Grid item>
                <Typography display="inline" variant="subtitle2">
                    Performed By:{" "}
                </Typography>

                <EditableTypography
                    variant="subtitle2"
                    placeholder="Rick Astley"
                    onValueChange={updatePerformerHandler}
                    data-testid="PerformedBy"
                >
                    {props.song.performedBy}
                </EditableTypography>
            </Grid>
        </Grid>
    );

    return (
        <Box
            paddingTop={theme.spacing(1.5)}
            paddingLeft={theme.spacing(0.5)}
            paddingRight={theme.spacing(0.5)}
            data-testid="Header"
        >
            <Grid container>
                {leftHeader}
                {midHeader}
                {rightHeader}
            </Grid>
        </Box>
    );
};

export default Header;
