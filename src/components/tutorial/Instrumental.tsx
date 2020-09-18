import { Typography } from "@material-ui/core";
import React from "react";
import {
    ChordBlock,
    SerializedLyric,
} from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak, LyricsTypography, ChordTypography } from "./Common";
import Playground from "./Playground";

const Instrumental: React.FC<{}> = (): JSX.Element => {
    const tabExample = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "Bm", lyric: new SerializedLyric("\t") }),
            new ChordBlock({ chord: "A", lyric: new SerializedLyric("\t|") }),
            new ChordBlock({ chord: "E", lyric: new SerializedLyric("\t") }),
            new ChordBlock({
                chord: "C#m7",
                lyric: new SerializedLyric("\t|"),
            }),
        ]),
    ]);

    const initialSong = new ChordSong();

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "Bm", lyric: new SerializedLyric("\t") }),
            new ChordBlock({ chord: "A", lyric: new SerializedLyric("\t|") }),
            new ChordBlock({ chord: "E", lyric: new SerializedLyric("\t") }),
            new ChordBlock({
                chord: "C#m7",
                lyric: new SerializedLyric("\t|"),
            }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Instrumental Sections</Typography>
            <LineBreak />
            <Typography>
                One way to annotate chords that do not happen over lyrics is
                using whitespace - notably{" "}
                <LyricsTypography display="inline">tab</LyricsTypography> or{" "}
                <LyricsTypography display="inline">space</LyricsTypography>.
                Both will provide an empty lyric space to anchor chords to and
                you should use either to get the formatting that you want.
            </Typography>
            <LineBreak />
            <Typography>
                Tabs are good for providing a large width for long instrumental
                sections. You can insert a{" "}
                <LyricsTypography display="inline">tab</LyricsTypography>{" "}
                character by pressing tab when editing lyrics.
            </Typography>
            <LineBreak />
            <Typography>
                This example demonstrates using tabs to make space to anchor
                chords, and using the | to divide and organize them.
            </Typography>
            <Playground initialSong={tabExample} />
            <LineBreak />
            <Typography>
                Let's replicate the example from above using just the{" "}
                <LyricsTypography display="inline">tab</LyricsTypography> and{" "}
                <LyricsTypography display="inline">|</LyricsTypography>{" "}
                characters. Insert 4 tabs by editing the lyrics, and pressing
                tab 4 times. Then divide them with{" "}
                <LyricsTypography display="inline">|</LyricsTypography> in the
                middle and at the end, and add{" "}
                <ChordTypography display="inline">Bm</ChordTypography>,{" "}
                <ChordTypography display="inline">A</ChordTypography>,{" "}
                <ChordTypography display="inline">E</ChordTypography>,{" "}
                <ChordTypography display="inline">C#m7</ChordTypography>{" "}
                respectively to each tab.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default Instrumental;
