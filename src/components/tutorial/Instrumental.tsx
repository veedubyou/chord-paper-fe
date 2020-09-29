import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { ChordTypography, LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const Instrumental: React.FC<{}> = (): JSX.Element => {
    const tabExample = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "Bm", lyric: new Lyric("<⑵>") }),
            new ChordBlock({ chord: "A", lyric: new Lyric("<⑵>") }),
            new ChordBlock({ chord: "E", lyric: new Lyric("<⑷>") }),
        ]),
    ]);

    const initialSong = new ChordSong();

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "Bm", lyric: new Lyric("<⑵>") }),
            new ChordBlock({ chord: "A", lyric: new Lyric("<⑵>") }),
            new ChordBlock({ chord: "E", lyric: new Lyric("<⑷>") }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Instrumental Sections</Typography>
            <LineBreak />
            <Typography>
                In addition to putting chords over lyrics, you can also put them
                in the spaces between lyrics. When there are no lyrics around
                the harmony, you can use tabs to create spacing in the lyrics
                for placing chords.
            </Typography>
            <LineBreak />
            <Typography>
                You can do this by hitting{" "}
                <LyricsTypography display="inline">tab</LyricsTypography> when
                editting lyrics, for a normal sized tab, or{" "}
                <LyricsTypography display="inline">
                    ALT/OPTION + tab
                </LyricsTypography>{" "}
                for a small sized tab, or{" "}
                <LyricsTypography display="inline">
                    SHIFT + tab
                </LyricsTypography>{" "}
                for a large sized tab.
            </Typography>
            <Playground initialSong={tabExample} />
            <LineBreak />
            <Typography>
                Let's replicate the example from above using{" "}
                <LyricsTypography display="inline">tab</LyricsTypography>s.
                Start by editing the lyrics. Insert two normal sized tabs with
                the <LyricsTypography display="inline">tab</LyricsTypography>{" "}
                key, and a large sized tab using{" "}
                <LyricsTypography display="inline">
                    SHIFT + tab
                </LyricsTypography>{" "}
                key. Then add{" "}
                <ChordTypography display="inline">Bm</ChordTypography>,{" "}
                <ChordTypography display="inline">A</ChordTypography>,{" "}
                <ChordTypography display="inline">E</ChordTypography>,{" "}
                respectively to each tab.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default Instrumental;
