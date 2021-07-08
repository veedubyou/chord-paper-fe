import {
    Badge as UnstyledBadge,
    Paper,
    Theme,
    withStyles,
} from "@material-ui/core";
import UnstyledCheckCircleIcon from "@material-ui/icons/CheckCircle";
import React, { useEffect, useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "../edit/ChordPaperBody";
import { useChordSongReducer } from "../reducer/reducer";

const CheckCircleIcon = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.success.main,
    },
}))(UnstyledCheckCircleIcon);

const Badge = withStyles({
    root: {
        display: "inherit",
    },
})(UnstyledBadge);

interface PlaygroundProps {
    initialSong: ChordSong;
    expectedSong?: ChordSong;
}

const Playground: React.FC<PlaygroundProps> = (
    props: PlaygroundProps
): JSX.Element => {
    const songChangeHandler = (updatedSong: ChordSong) => {};

    const [song, songDispatch] = useChordSongReducer(
        props.initialSong,
        songChangeHandler
    );

    const [finish, setFinish] = useState(false);

    const { expectedSong } = props;

    useEffect(() => {
        // don't undo the green check if it's already been passing
        if (finish) {
            return;
        }

        if (expectedSong !== undefined && expectedSong.contentEquals(song)) {
            setFinish(true);
        }
    }, [song, expectedSong, finish, setFinish]);

    return (
        <Badge badgeContent={<CheckCircleIcon />} invisible={!finish}>
            <Paper elevation={1}>
                <ChordPaperBody
                    song={song}
                    songDispatch={songDispatch}
                    onSongChanged={songChangeHandler}
                />
            </Paper>
        </Badge>
    );
};

export default Playground;
