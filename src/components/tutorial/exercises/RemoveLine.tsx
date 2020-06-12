import React from "react";
import { Typography } from "@material-ui/core";
import Playground from "./Playground";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import {
    ExerciseBox,
    LineBreak,
    LyricsTypography,
    ChordTypography,
} from "./Common";

const RemoveLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "Every time you are near" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Removing Lines</Typography>
            <LineBreak />
            <Typography>
                Similarly, you can remove a line by hovering over the line, and
                clicking the red remove icon to the right. Let's remove the
                second line of lyrics.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

export default RemoveLine;
