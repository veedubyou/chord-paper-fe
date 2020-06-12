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

const AddLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "Every time you are near" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Adding New Lines</Typography>
            <LineBreak />
            <Typography>
                You can add more lines by hovering below (or above) and existing
                line, and clicking the gray line or the add icon to the right.
            </Typography>
            <Typography>Let's add a line, and change the lyrics to:</Typography>
            <LyricsTypography>Why do birds suddenly appear?</LyricsTypography>
            <LyricsTypography>Every time you are near</LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

export default AddLine;
