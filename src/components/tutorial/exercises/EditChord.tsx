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

const EditChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "Bm", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Editing Chords</Typography>
            <LineBreak />
            <Typography>
                Click on a chord to change it. Let's change the chord above{" "}
                <LyricsTypography display="inline">"appear"</LyricsTypography>{" "}
                from <ChordTypography display="inline">Bm</ChordTypography> to{" "}
                <ChordTypography display="inline">B7</ChordTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

export default EditChord;
