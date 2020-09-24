import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const EditLyrics: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why do birds suddenly "),
            }),
            new ChordBlock({
                chord: "B7",
                lyric: new Lyric("appear?"),
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why oh why do birds suddenly "),
            }),
            new ChordBlock({
                chord: "B7",
                lyric: new Lyric("appear?"),
            }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Editing Lyrics</Typography>
            <LineBreak />
            <Typography>
                You can edit the lyrics by clicking anywhere along the lyrics.
                Finish editing lyrics by pressing enter or clicking outside the
                text edit box. Chord Paper will move chords along with lyrics
                when you edit them. Let's change the lyrics to:
            </Typography>
            <LyricsTypography>
                Why oh why do birds suddenly appear?
            </LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default EditLyrics;
