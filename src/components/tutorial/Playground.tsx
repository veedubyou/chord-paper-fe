import { Badge as UnstyledBadge, Paper, withStyles } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import UnstyledCheckCircleIcon from "@material-ui/icons/CheckCircle";
import React, { useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "../ChordPaperBody";

const CheckCircleIcon = withStyles({
    root: {
        color: green[200],
    },
})(UnstyledCheckCircleIcon);

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
    const [song, setSong] = useState<ChordSong>(props.initialSong);
    const [finish, setFinish] = useState(false);

    const songChangeHandler = (updatedSong: ChordSong) => {
        console.log(updatedSong);
        setSong(updatedSong.clone());
        checkExpected(updatedSong);
    };

    const checkExpected = (updatedSong: ChordSong) => {
        // don't undo the green check if it's already been passing
        if (finish) {
            return;
        }

        if (
            props.expectedSong !== undefined &&
            props.expectedSong.contentEquals(updatedSong)
        ) {
            setFinish(true);
        }
    };

    return (
        <Badge badgeContent={<CheckCircleIcon />} invisible={!finish}>
            <Paper elevation={1}>
                <ChordPaperBody song={song} onSongChanged={songChangeHandler} />
            </Paper>
        </Badge>
    );
};

export default Playground;