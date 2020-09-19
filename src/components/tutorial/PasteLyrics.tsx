import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock, Lyric } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const PasteLyrics: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why do birds suddenly ap-"),
            }),
            new ChordBlock({
                chord: "B7sus4",
                lyric: new Lyric("pear?"),
            }),
            new ChordBlock({ chord: "B7", lyric: new Lyric("\t") }),
        ]),
        new ChordLine(),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why do birds suddenly ap-"),
            }),
            new ChordBlock({
                chord: "B7sus4",
                lyric: new Lyric("pear?"),
            }),
            new ChordBlock({ chord: "B7", lyric: new Lyric("\t") }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Every time you are near"),
            }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Just like me, they long to be"),
            }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Close to you"),
            }),
        ]),
    ]);

    return (
        <>
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
        </>
    );
};

export default PasteLyrics;
