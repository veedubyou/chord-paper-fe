import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";

const CopyAndPaste: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "But I'm a " }),
            new ChordBlock({ chord: "G", lyric: "creep, I'm a " }),
            new ChordBlock({ chord: "B7", lyric: "weirdo" }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "What the hell am doing " }),
            new ChordBlock({ chord: "C", lyric: "here? I don't be-" }),
            new ChordBlock({ chord: "Cm", lyric: "long here" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I don't care if it ",
            }),
            new ChordBlock({ chord: "G", lyric: "hurts, I wanna have con-" }),
            new ChordBlock({ chord: "B7", lyric: "trol" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I want a perfect ",
            }),
            new ChordBlock({ chord: "C", lyric: "body, I want a perfect " }),
            new ChordBlock({ chord: "Cm", lyric: "soul" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I want you to ",
            }),
            new ChordBlock({ chord: "G", lyric: "notice when I'm not a-" }),
            new ChordBlock({ chord: "B7", lyric: "round" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "You're so fucking ",
            }),
            new ChordBlock({ chord: "C", lyric: "special, I wish I was " }),
            new ChordBlock({ chord: "Cm", lyric: "special" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "But I'm a " }),
            new ChordBlock({ chord: "G", lyric: "creep, I'm a " }),
            new ChordBlock({ chord: "B7", lyric: "weirdo" }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "What the hell am doing " }),
            new ChordBlock({ chord: "C", lyric: "here? I don't be-" }),
            new ChordBlock({ chord: "Cm", lyric: "long here" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I don't care if it ",
            }),
            new ChordBlock({ chord: "G", lyric: "hurts, I wanna have con-" }),
            new ChordBlock({ chord: "B7", lyric: "trol" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I want a perfect ",
            }),
            new ChordBlock({ chord: "C", lyric: "body, I want a perfect " }),
            new ChordBlock({ chord: "Cm", lyric: "soul" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "I want you to ",
            }),
            new ChordBlock({ chord: "G", lyric: "notice when I'm not a-" }),
            new ChordBlock({ chord: "B7", lyric: "round" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "You're so fucking ",
            }),
            new ChordBlock({ chord: "C", lyric: "special, I wish I was " }),
            new ChordBlock({ chord: "Cm", lyric: "special" }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "But I'm a " }),
            new ChordBlock({ chord: "G", lyric: "creep, I'm a " }),
            new ChordBlock({ chord: "B7", lyric: "weirdo" }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "What the hell am doing " }),
            new ChordBlock({ chord: "C", lyric: "here? I don't be-" }),
            new ChordBlock({ chord: "Cm", lyric: "long here" }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Copying and Pasting Lines</Typography>
            <LineBreak />
            <Typography>
                Sometimes you want to just repeat what's on the page without
                entering it all over again - choruses with the same lyrics,
                repeating instrumental sections. You can do this by copying and
                pasting entire lines that you've already written out.
            </Typography>
            <LineBreak />
            <Typography>
                The easiest way to copy is to drag down from some empty space on
                the left of the line you wish to start copying from, then
                pressing (CTRL or CMD) + C, or right click -> copy.
            </Typography>
            <LineBreak />
            <Typography>
                To paste, click to edit a lyric line, and press (CTRL or CMD) +
                V, or right click -> paste.
            </Typography>
            <LineBreak />
            <Typography>
                Note that there's no partial copy - if any part of the line is
                selected during the copy, the whole line is copied.
            </Typography>
            <LineBreak />
            <Typography>
                If you have trouble selecting a line, try dragging your cursor
                starting further left and above the line.
            </Typography>
            <LineBreak />
            <Typography>
                Let's try copying and pasting the repeated chorus:
            </Typography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                But I'm a creep, I'm a weirdo
            </LyricsTypography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                What the hell am I doing here? I don't belong here.
            </LyricsTypography>
            <LineBreak />
            <Typography>
                Copy those two lines, add a new line at the bottom, and paste it
                there.
            </Typography>

            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default CopyAndPaste;