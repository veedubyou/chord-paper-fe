import { Box, Grid, Theme, Typography } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/styles";
import React from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import UnstyledLastSavedAt from "../display/LastSavedAt";
import EditableTypography from "./EditableTypography";

const LastSavedAt = withStyles((theme: Theme) => ({
    root: {
        position: "absolute",
        top: theme.spacing(2),
        right: theme.spacing(2),
    },
}))(UnstyledLastSavedAt);

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
                value={props.song.title}
                variant="h4"
                align="center"
                data-testid="SongTitle"
                placeholder="Song Title"
                onValueChange={updateTitleHandler}
            />
        </Box>
    );

    const lastSavedAt: React.ReactNode =
        props.song.lastSavedAt === null ? null : (
            <LastSavedAt lastSaved={props.song.lastSavedAt} />
        );

    const details = (
        <Grid container justify="center">
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="block" variant="caption">
                        Composed by:{" "}
                    </Typography>

                    <EditableTypography
                        value={props.song.composedBy}
                        display="block"
                        variant="caption"
                        placeholder="Stock Aitken Waterman"
                        onValueChange={updateComposeHandler}
                        data-testid="ComposedBy"
                    />
                </Grid>
            </Grid>
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="inline" variant="caption">
                        Performed by:{" "}
                    </Typography>

                    <EditableTypography
                        value={props.song.performedBy}
                        variant="caption"
                        placeholder="Rick Astley"
                        onValueChange={updatePerformerHandler}
                        data-testid="PerformedBy"
                    />
                </Grid>
            </Grid>
            <Grid container item xs={4} justify="center">
                <Grid item>
                    <Typography display="inline" variant="caption">
                        As heard from:{" "}
                    </Typography>
                    <EditableTypography
                        value={props.song.asHeardFrom}
                        variant="caption"
                        placeholder="https://www.youtube.com/watch?v=dM9zwZCOmjM"
                        onValueChange={updateHeardFrom}
                        data-testid="AsHeardAt"
                    />
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
            {lastSavedAt}
            {title}
            {details}
        </Box>
    );
};

export default Header;
