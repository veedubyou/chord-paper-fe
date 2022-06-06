import { Typography } from "@mui/material";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Lyric } from "common/ChordModel/Lyric";
import { LineBreak } from "components/tutorial/Common";
import Playground from "components/tutorial/Playground";
import { convertToTutorialComponent } from "components/tutorial/TutorialComponent";
import React from "react";

const title = "Remove Multiple Lines";

const RemoveMultipleLines: React.FC<{}> = (): JSX.Element => {
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
                        lyric: new Lyric("pear?"),
                    }),
                    new ChordBlock({ chord: "B7", lyric: new Lyric("\ue200") }),
                ],
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("Every "),
                    }),
                    new ChordBlock({
                        chord: "Bm7",
                        lyric: new Lyric("time you are "),
                    }),
                    new ChordBlock({
                        chord: "Em7",
                        lyric: new Lyric("near"),
                    }),
                ],
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "Am7",
                        lyric: new Lyric("Just like me, "),
                    }),
                    new ChordBlock({
                        chord: "D7",
                        lyric: new Lyric("they long to be"),
                    }),
                ],
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "G^",
                        lyric: new Lyric("Close to you"),
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
                You can remove multiple lines at once by dragging and selecting
                over multiple lines, and then pressing Backspace/Delete.
            </Typography>
            <LineBreak />
            <Typography>Let's remove the last three lines.</Typography>
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default convertToTutorialComponent(RemoveMultipleLines, title);
