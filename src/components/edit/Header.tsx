import { Box, Grid, Theme, Typography } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/styles";
import React from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import UnstyledLastSavedAt from "../display/LastSavedAt";
import { ChordSongAction } from "../reducer/reducer";
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
    songDispatch: React.Dispatch<ChordSongAction>;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps): JSX.Element => {
    const theme: Theme = useTheme();

    const updateTitleHandler = (newTitle: string) => {
        props.songDispatch({ type: "set-header", title: newTitle });
    };

    const updateComposeHandler = (newComposer: string) => {
        props.songDispatch({ type: "set-header", composedBy: newComposer });
    };

    const updatePerformerHandler = (newPerformer: string) => {
        props.songDispatch({ type: "set-header", performedBy: newPerformer });
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
            <Grid container item xs={6} justify="center">
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
            <Grid container item xs={6} justify="center">
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

export default React.memo(Header);
