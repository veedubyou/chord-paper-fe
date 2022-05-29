import UnstyledCheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Badge as UnstyledBadge, Paper, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import ChordPaperBody from "../edit/ChordPaperBody";
import { useChordSongReducer } from "../reducer/reducer";

const CheckCircleIcon = styled(UnstyledCheckCircleIcon)(({ theme }) => ({
    color: theme.palette.success.main,
}));

const Badge = styled(UnstyledBadge)({
    display: "inherit",
});

interface PlaygroundProps {
    initialSong: ChordSong;
    expectedSong?: ChordSong;
}

const Playground: React.FC<PlaygroundProps> = (
    props: PlaygroundProps
): JSX.Element => {
    const [song, songDispatch] = useChordSongReducer(props.initialSong);

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
                <ChordPaperBody song={song} songDispatch={songDispatch} />
            </Paper>
        </Badge>
    );
};

export default Playground;
