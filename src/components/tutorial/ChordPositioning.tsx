import React from "react";
import { Typography } from "@material-ui/core";
import Playground from "./Playground";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { LineBreak, LyricsTypography, ChordTypography } from "./Common";
import { Lyric } from "../../common/ChordModel/Lyric";
import { convertToTutorialComponent } from "./TutorialComponent";

const title = "Chord Positioning"

const ChordPositioning: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds suddenly "),
                    }),
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("appear?"),
                    }),
                ],
            }),
        ],
    });

    const example = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds suddenly"),
                    }),
                    new ChordBlock({
                        chord: "F#7",
                        lyric: new Lyric(" ap-"),
                    }),
                    new ChordBlock({
                        chord: "B7sus4",
                        lyric: new Lyric("pear?"),
                    }),
                    new ChordBlock({ chord: "B7", lyric: new Lyric("\ue200") }),
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
                        lyric: new Lyric("Why do birds suddenly"),
                    }),
                    new ChordBlock({
                        chord: "F#7",
                        lyric: new Lyric(" ap-"),
                    }),
                    new ChordBlock({
                        chord: "B7sus4",
                        lyric: new Lyric("pear?"),
                    }),
                    new ChordBlock({ chord: "B7", lyric: new Lyric("\ue200") }),
                ],
            }),
        ],
    });

    return (
        <>
            <Typography variant="h5">{title}</Typography>
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
                And add a tab after the{" "}
                <LyricsTypography display="inline">?</LyricsTypography>
            </Typography>
            <Typography>
                Then add the chord{" "}
                <ChordTypography display="inline">F#7</ChordTypography> to the
                space before{" "}
                <LyricsTypography display="inline">ap-</LyricsTypography>
            </Typography>
            <Typography>
                Add the chord{" "}
                <ChordTypography display="inline">B7sus4</ChordTypography> to{" "}
                <LyricsTypography display="inline">pear</LyricsTypography>
            </Typography>
            <Typography>
                Add the chord{" "}
                <ChordTypography display="inline">B7</ChordTypography> to the
                tabbed space after{" "}
            </Typography>
            <Typography>It should look like this:</Typography>
            <Playground initialSong={example} />
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default convertToTutorialComponent(ChordPositioning, title);
