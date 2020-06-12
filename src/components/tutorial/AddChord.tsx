import React from "react";
import { Typography } from "@material-ui/core";
import Playground from "./Playground";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { LineBreak, LyricsTypography, ChordTypography } from "./Common";

const AddChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly appear?",
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly ",
            }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Adding Chords</Typography>
            <LineBreak />
            <Typography>
                Add a chord by hovering above a word, and clicking the outlined
                box. Let's add{" "}
                <ChordTypography display="inline">B7</ChordTypography> back
                above{" "}
                <LyricsTypography display="inline">appear</LyricsTypography>.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default AddChord;
