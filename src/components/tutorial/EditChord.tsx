import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordTypography, LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const EditChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: { serializedLyrics: "Why do birds suddenly " },
            }),
            new ChordBlock({
                chord: "Bm",
                lyric: { serializedLyrics: "appear?" },
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: { serializedLyrics: "Why do birds suddenly " },
            }),
            new ChordBlock({
                chord: "B7",
                lyric: { serializedLyrics: "appear?" },
            }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Editing Chords</Typography>
            <LineBreak />
            <Typography>
                Click on a chord to change it, then press enter to commit your
                changes. Let's change the chord above{" "}
                <LyricsTypography display="inline">appear</LyricsTypography>{" "}
                from <ChordTypography display="inline">Bm</ChordTypography> to{" "}
                <ChordTypography display="inline">B7</ChordTypography>.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default EditChord;
