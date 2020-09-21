import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const SplitLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric(
                    "Why do birds suddenly appear? Every time you are near"
                ),
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Why do birds suddenly appear? "),
            }),
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
            <Typography variant="h6">Splitting Lines</Typography>
            <LineBreak />
            <Typography>
                Similarly, we can split lines that may be too long for our chart
                into two lines. Move the cursor to where you want the line to
                split, and press
            </Typography>
            <Typography>(CTRL+Enter : Windows | CMD+Enter : Mac)</Typography>
            <LineBreak />
            <Typography>
                Right now, chords won't move to the subsequent line - only
                lyrics will. This can be worked around by dragging and dropping
                chords after until the feature is cleaned up.
            </Typography>
            <LineBreak />
            <Typography>
                Let's break the one long line of lyrics up, so that it looks
                like:
            </Typography>
            <LyricsTypography>Why do birds suddenly appear?</LyricsTypography>
            <LyricsTypography>Every time you are near</LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default SplitLine;
