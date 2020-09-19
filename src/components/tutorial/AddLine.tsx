import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock, Lyric } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const AddLine: React.FC<{}> = (): JSX.Element => {
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
    ]);

    return (
        <>
            <Typography variant="h6">Adding New Lines</Typography>
            <LineBreak />
            <Typography>
                You can add more lines by hovering below (or above) and existing
                line, and clicking the gray line or the add icon to the right.
            </Typography>
            <Typography>Let's add a line, and change the lyrics to:</Typography>
            <LyricsTypography>Why do birds suddenly ap-pear?</LyricsTypography>
            <LyricsTypography>Every time you are near</LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default AddLine;
