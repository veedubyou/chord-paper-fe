import React from "react";
import { Typography } from "@material-ui/core";
import Playground from "./Playground";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { LineBreak, LyricsTypography, ChordTypography } from "./Common";

const ChordPositioning: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "", lyric: "appear?" }),
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
        <>
            <Typography variant="h6">Chord Positioning</Typography>
            <LineBreak />
            <Typography>
                Sometimes you want to emphasize a chord landing on a specific
                syllable or between words. Without the overhead of standard
                notation, we can do this by breaking up lyrics and annotating
                spaces.
            </Typography>
            <LineBreak />

            <Typography>Let's change the lyrics to:</Typography>
            <LyricsTypography>Why do birds suddenly ap-pear?</LyricsTypography>
            <Typography>
                And add a space after the{" "}
                <LyricsTypography display="inline">?</LyricsTypography>
            </Typography>
            <Typography>
                Then add{" "}
                <ChordTypography display="inline">B7sus4</ChordTypography> to{" "}
                <LyricsTypography display="inline">pear</LyricsTypography>
            </Typography>
            <Typography>
                And then, also add{" "}
                <ChordTypography display="inline">B7</ChordTypography> to the
                space after{" "}
                <LyricsTypography display="inline">?</LyricsTypography> (this
                can be tricky due to the spacing. work in progress)
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default ChordPositioning;
