import { Typography } from "@mui/material";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { Lyric } from "common/ChordModel/Lyric";
import { LineBreak, LyricsTypography } from "components/tutorial/Common";
import Playground from "components/tutorial/Playground";
import { convertToTutorialComponent } from "components/tutorial/TutorialComponent";
import React from "react";

const title = "Edit Lyrics";

const EditLyrics: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong({
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

    const expectedSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why oh why do birds suddenly "),
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

export default convertToTutorialComponent(EditLyrics, title);
