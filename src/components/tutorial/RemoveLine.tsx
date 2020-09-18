import { Typography, withStyles } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak } from "./Common";
import Playground from "./Playground";

const BackspaceIcon = withStyles({
    root: {
        color: red[300],
    },
})(UnstyledBackspaceIcon);

const RemoveLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: { serializedLyrics: "Why do birds suddenly ap-" },
            }),
            new ChordBlock({
                chord: "B7sus4",
                lyric: { serializedLyrics: "pear?" },
            }),
            new ChordBlock({ chord: "B7", lyric: { serializedLyrics: "\t" } }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: { serializedLyrics: "Every time you are near" },
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: { serializedLyrics: "Why do birds suddenly ap-" },
            }),
            new ChordBlock({
                chord: "B7sus4",
                lyric: { serializedLyrics: "pear?" },
            }),
            new ChordBlock({ chord: "B7", lyric: { serializedLyrics: "\t" } }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Removing Lines</Typography>
            <LineBreak />
            <Typography>
                Similarly, you can remove a line by hovering over the line, and
                clicking the <BackspaceIcon /> icon to the right. Let's remove
                the second line of lyrics.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default RemoveLine;
