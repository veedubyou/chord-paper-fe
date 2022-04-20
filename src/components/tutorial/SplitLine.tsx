import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { LineBreak, LyricsTypography } from "./Common";
import Playground from "./Playground";
import { convertToTutorialComponent } from "./TutorialComponent";

const title = "Split Lines";

const SplitLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds suddenly ap-"),
                    }),

                    new ChordBlock({
                        chord: "B7sus4",
                        lyric: new Lyric("pear? Every "),
                    }),
                    new ChordBlock({
                        chord: "B7",
                        lyric: new Lyric("time you are near"),
                    }),
                ],
            }),
        ],
    });

    const expectedSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds suddenly ap-"),
                    }),

                    new ChordBlock({
                        chord: "B7sus4",
                        lyric: new Lyric("pear? "),
                    }),
                ],
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("Every "),
                    }),
                    new ChordBlock({
                        chord: "B7",
                        lyric: new Lyric("time you are near"),
                    }),
                ],
            }),
        ],
    });

    return (
        <>
            <Typography variant="h5">{title}</Typography>
            <LineBreak />
            <Typography>
                Similarly, we can split lines that may be too long for our chart
                into two lines. Move the cursor to where you want the line to
                split, and press
            </Typography>
            <Typography>(CTRL+Enter : Windows | CMD+Enter : Mac)</Typography>
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

export default convertToTutorialComponent(SplitLine, title);
