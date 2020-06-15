import { Typography } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { LineBreak } from "./Common";
import Playground from "./Playground";

const MergeLine: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds",
            }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "suddenly ",
            }),
            new ChordBlock({
                chord: "B7",
                lyric: "appear?",
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly ",
            }),
            new ChordBlock({
                chord: "B7",
                lyric: "appear?",
            }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Merging Lines</Typography>
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

export default MergeLine;
