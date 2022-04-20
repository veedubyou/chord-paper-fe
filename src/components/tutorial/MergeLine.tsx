import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { LineBreak } from "./Common";
import Playground from "./Playground";
import { convertToTutorialComponent } from "./TutorialComponent";

const title = "Merge Lines";

const MergeLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong({
        lines: [
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "C^",
                        lyric: new Lyric("Why do birds"),
                    }),
                ],
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("suddenly "),
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
                Sometimes the lyrics that we paste in is not the division we
                want. Let's merge the two lines. Click into the second line,
                move the cursor to the beginning of the line, and press
            </Typography>
            <Typography>
                (CTRL+Backspace : Windows | CMD+Backspace : Mac)
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default convertToTutorialComponent(MergeLine, title);
