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

const RemoveChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly appear?",
            }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Removing Chords</Typography>
            <LineBreak />
            <Typography>
                Simply remove all the chord text when editing to clear the
                chord. Let's remove the{" "}
                <ChordTypography display="inline">B7</ChordTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

export default RemoveChord;
