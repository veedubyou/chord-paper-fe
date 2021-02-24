import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { ChordTypography, LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const DragAndDropChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why do birds "),
            }),
            new ChordBlock({
                chord: "B7",
                lyric: new Lyric("suddenly appear?"),
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
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

    return (
        <>
            <Typography variant="h6">Dragging and Dropping Chords</Typography>
            <LineBreak />
            <Typography>
                It's also possible to drag and drop chords onto different parts
                of the line when its initial placement wasn't quite correct.
                Just drag a chord and drop it to the space above or on another
                lyric.
            </Typography>
            <LineBreak />
            <Typography>
                If you hold CTRL or CMD while dragging and dropping, the chord
                will be copied instead of moved over.
            </Typography>
            <LineBreak />
            <Typography>
                Let's move the{" "}
                <ChordTypography display="inline">B7</ChordTypography> above{" "}
                <LyricsTypography display="inline">suddenly</LyricsTypography>{" "}
                to above{" "}
                <LyricsTypography display="inline">appear</LyricsTypography>.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default DragAndDropChord;
