import { Typography } from "@mui/material";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Lyric } from "common/ChordModel/Lyric";
import { ChordTypography, LineBreak, LyricsTypography } from "components/tutorial/Common";
import Playground from "components/tutorial/Playground";
import { convertToTutorialComponent } from "components/tutorial/TutorialComponent";
import React from "react";

const title = "Edit Chords";

const EditChord: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds suddenly "),
                    }),
                    new ChordBlock({
                        chord: "Bm",
                        lyric: new Lyric("appear?"),
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
                        lyric: new Lyric("Why do birds suddenly "),
                    }),
                    new ChordBlock({
                        chord: "B7",
                        lyric: new Lyric("appear?"),
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
                Click on a chord to change it, then press enter to commit your
                changes. Let's change the chord above{" "}
                <LyricsTypography display="inline">appear</LyricsTypography>{" "}
                from <ChordTypography display="inline">Bm</ChordTypography> to{" "}
                <ChordTypography display="inline">B7</ChordTypography>.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default convertToTutorialComponent(EditChord, title);
