import { Typography, withStyles } from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubbleOutline";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { sectionLabelStyle } from "../display/SectionLabel";
import { LineBreak } from "./Common";
import Playground from "./Playground";

const LabelTypography = withStyles(sectionLabelStyle)(Typography);

const Labels: React.FC<{}> = (): JSX.Element => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: new Lyric("Why do birds suddenly ap-"),
            }),
            new ChordBlock({
                chord: "B7sus4",
                lyric: new Lyric("pear?"),
            }),
            new ChordBlock({ chord: "B7", lyric: new Lyric("\ue200") }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Every time you are near"),
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine(
            [
                new ChordBlock({
                    chord: "C^",
                    lyric: new Lyric("Why do birds suddenly ap-"),
                }),
                new ChordBlock({
                    chord: "B7sus4",
                    lyric: new Lyric("pear?"),
                }),
                new ChordBlock({
                    chord: "B7",
                    lyric: new Lyric("\ue200"),
                }),
            ],
            "Verse"
        ),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: new Lyric("Every time you are near"),
            }),
        ]),
    ]);

    return (
        <>
            <Typography variant="h6">Labels</Typography>
            <LineBreak />
            <Typography>
                It's common to label sections to navigate easily within the
                song. For example, some common labels are "Verse", "Chorus",
                "Bridge", or more simplified markers like "A", "B", etc.
            </Typography>
            <LineBreak />
            <Typography>
                Add a label to a line by hovering over the line, and then
                clicking the <ChatBubbleIcon /> icon to insert a label for that
                line. Let's add{" "}
                <LabelTypography display="inline">Verse</LabelTypography> to the
                first line.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </>
    );
};

export default Labels;
