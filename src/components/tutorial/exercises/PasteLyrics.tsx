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

const PasteLyrics: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine(),
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
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "Just like me, they long to be",
            }),
        ]),
        new ChordLine([new ChordBlock({ chord: "", lyric: "Close to you" })]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Pasting Lyrics</Typography>
            <LineBreak />
            <Typography>
                It would be annoying to have to type out the lyrics. But we can
                paste it in! Copy these lyrics, click into the second line, and
                paste:
            </Typography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Every time you are near
            </LyricsTypography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Just like me, they long to be
            </LyricsTypography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Close to you
            </LyricsTypography>

            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

export default PasteLyrics;
