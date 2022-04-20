import { Typography, withStyles } from "@material-ui/core";
import SlowMotionVideoIcon from "@material-ui/icons/SlowMotionVideo";
import React, { useContext } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { Lyric } from "../../common/ChordModel/Lyric";
import { sectionLabelStyle } from "../display/SectionLabel";
import PlayerTimeProvider, { PlayerTimeContext } from "../PlayerTimeContext";
import { LineBreak } from "./Common";
import Playground from "./Playground";
import { convertToTutorialComponent } from "./TutorialComponent";
import { getRouteForTutorialComponent } from "../Tutorial";
import TrackPlayer from "./TrackPlayer";
import { Link } from "react-router-dom";

const title = "Labels with Timestamp";

const LabelTypography = withStyles(sectionLabelStyle)(Typography);

const TimeSetter: React.FC<{}> = (): null => {
    const getPlayerTimeRef = useContext(PlayerTimeContext);
    getPlayerTimeRef.current = () => 83;
    return null;
};

const TimeLabels: React.FC<{}> = (): JSX.Element => {
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
                    new ChordBlock({
                        chord: "B7",
                        lyric: new Lyric("\ue200"),
                    }),
                ],
                section: {
                    type: "label",
                    name: "Verse",
                },
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("Every time you are near"),
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
                    new ChordBlock({
                        chord: "B7",
                        lyric: new Lyric("\ue200"),
                    }),
                ],
                section: {
                    type: "time",
                    name: "Verse",
                    time: 83,
                },
            }),
            new ChordLine({
                blocks: [
                    new ChordBlock({
                        chord: "",
                        lyric: new Lyric("Every time you are near"),
                    }),
                ],
            }),
        ],
    });

    const trackPlayerRoute = getRouteForTutorialComponent(TrackPlayer);

    return (
        <>
            <Typography variant="h5">{title}</Typography>
            <LineBreak />
            <Typography>
                After creating a label, it's possible to annotate each section
                with the time of recording, e.g. this verse is at 2:10.
            </Typography>
            <LineBreak />
            <Typography>
                If you hover over the{" "}
                <LabelTypography display="inline">Verse</LabelTypography> label,
                a floating input will show up. You can enter a time by typing it
                in, and then pressing enter.
            </Typography>
            <LineBreak />
            <Typography>
                Alternatively, you can set the time to the current time in the{" "}
                <Link to={trackPlayerRoute}>track player</Link> by clicking the{" "}
                <SlowMotionVideoIcon /> button.
            </Typography>
            <LineBreak />
            <Typography>
                In this example, pretend that the current verse starts at time
                1:23 and that is the current time in the track player. Let's set
                the time of the label to 1:23 by clicking the{" "}
                <SlowMotionVideoIcon /> button.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <PlayerTimeProvider>
                <TimeSetter />
                <Playground
                    initialSong={initialSong}
                    expectedSong={expectedSong}
                />
            </PlayerTimeProvider>
        </>
    );
};

export default convertToTutorialComponent(TimeLabels, title);
