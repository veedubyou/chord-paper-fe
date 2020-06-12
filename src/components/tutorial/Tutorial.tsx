import React from "react";
import { Paper, Typography, Theme, Grid, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { inflatingWhitespace } from "../../common/Whitespace";
import Playground from "./Playground";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";

const RootPaper = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(5),
        padding: theme.spacing(5),
        minHeight: theme.spacing(46),
        minWidth: theme.spacing(92),
    },
}))(Paper);

const ExerciseBox = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}))(Box);

const LyricsTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(Typography);

const ChordTypography = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.secondary.light,
    },
}))(Typography);

const Header = () => {
    return <Typography variant="h5">Learning Chord Paper</Typography>;
};

const Preamble = () => {
    return (
        <>
            <Typography>
                Chord Paper aims to be as intuitive and handy as possible, but
                there could still be features that you don't know about
                immediately. Let's walk through the basics together!
            </Typography>
            <Typography>
                Since Chord Paper is still in early stages, some of these could
                change in the future.
            </Typography>
        </>
    );
};

const EditLyrics = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why oh why do birds suddenly ",
            }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Editing Lyrics</Typography>
            <LineBreak />
            <Typography>
                You can edit the lyrics by clicking anywhere along the lyrics.
                Chord Paper will move chords along with lyrics when you edit
                them.
            </Typography>
            <LyricsTypography>
                Why oh why do birds suddenly appear?
            </LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const ChordPositioning = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Chord Positioning</Typography>
            <LineBreak />
            <Typography>
                Sometimes you want to emphasize a chord landing on a specific
                syllable or between words. Without the overhead of standard
                notation, we can do this by breaking up lyrics and annotating
                spaces.
            </Typography>
            <Typography>Let's change the lyrics to:</Typography>
            <LyricsTypography>Why do birds suddenly ap-pear?</LyricsTypography>
            <Typography>
                And leave a space after the{" "}
                <LyricsTypography display="inline">?</LyricsTypography>
            </Typography>
            <Typography>
                Then add{" "}
                <ChordTypography display="inline">B7sus4</ChordTypography> to{" "}
                <LyricsTypography display="inline">"pear"</LyricsTypography>
            </Typography>
            <Typography>
                And then, also add{" "}
                <ChordTypography display="inline">B7</ChordTypography> to the
                space after{" "}
                <LyricsTypography display="inline">?</LyricsTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const AddLine = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "Every time you are near" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Adding New Lines</Typography>
            <LineBreak />
            <Typography>
                You can add more lines by hovering below (or above) and existing
                line, and clicking the gray line or the add icon to the right.
            </Typography>
            <Typography>Let's add a line, and change the lyrics to:</Typography>
            <LyricsTypography>Why do birds suddenly appear?</LyricsTypography>
            <LyricsTypography>Every time you are near</LyricsTypography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const RemoveLine = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "Every time you are near" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Removing Lines</Typography>
            <LineBreak />
            <Typography>
                Similarly, you can remove a line by hovering over the line, and
                clicking the red remove icon to the right. Let's remove the
                second line of lyrics.
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const EditChord = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "Bm", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Editing Chords</Typography>
            <LineBreak />
            <Typography>
                Click on a chord to change it. Let's change the chord above{" "}
                <LyricsTypography display="inline">"appear"</LyricsTypography>{" "}
                from <ChordTypography display="inline">Bm</ChordTypography> to{" "}
                <ChordTypography display="inline">B7</ChordTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const RemoveChord = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly " }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly appear?",
            }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Removing Chords</Typography>
            <LineBreak />
            <Typography>
                Simply remove all the chord text when editing to clear the
                chord. Let's remove the{" "}
                <ChordTypography display="inline">B7</ChordTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const PastingLyrics = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine(),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({ chord: "C^", lyric: "Why do birds suddenly ap-" }),
            new ChordBlock({ chord: "B7sus4", lyric: "pear?" }),
            new ChordBlock({ chord: "B7", lyric: " " }),
        ]),
        new ChordLine([
            new ChordBlock({ chord: "", lyric: "Every time you are near" }),
        ]),
        new ChordLine([
            new ChordBlock({
                chord: "",
                lyric: "Just like me, they long to be",
            }),
        ]),
        new ChordLine([new ChordBlock({ chord: "", lyric: "Close to you" })]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Pasting Lyrics</Typography>
            <LineBreak />
            <Typography>
                It would be annoying to have to type out the lyrics. But we can
                paste it in! Copy these lyrics, click into the second line, and
                paste:
            </Typography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Every time you are near
            </LyricsTypography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Just like me, they long to be
            </LyricsTypography>
            <LyricsTypography variantMapping={{ body1: "div" }}>
                Close to you
            </LyricsTypography>

            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const AddChord = () => {
    const initialSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly appear?",
            }),
        ]),
    ]);

    const expectedSong = new ChordSong([
        new ChordLine([
            new ChordBlock({
                chord: "C^",
                lyric: "Why do birds suddenly ",
            }),
            new ChordBlock({ chord: "B7", lyric: "appear?" }),
        ]),
    ]);

    return (
        <ExerciseBox>
            <Typography variant="h6">Adding Chords</Typography>
            <LineBreak />
            <Typography>
                Add a chord by hovering over a word, and clicking the music
                note. Let's add{" "}
                <ChordTypography display="inline">B7</ChordTypography> back
                above <LyricsTypography>appear</LyricsTypography>
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const MergeLine = () => {
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
        <ExerciseBox>
            <Typography variant="h6">Merging Lines</Typography>
            <LineBreak />
            <Typography>
                Sometimes the lyrics that we paste in is not the division we
                want. Let's merge the two lines. Click into the second line,
                move the cursor to the beginning, and press
            </Typography>
            <Typography>
                (CTRL+Backspace : Windows | CMD+Backspace : Mac)
            </Typography>
            <LineBreak />
            <Typography>Try it!</Typography>
            <Playground initialSong={initialSong} expectedSong={expectedSong} />
        </ExerciseBox>
    );
};

const LineBreak = () => {
    return <Typography>{inflatingWhitespace()}</Typography>;
};

const Tutorial: React.FC<{}> = (): JSX.Element => {
    return (
        <Grid container data-testid="Tutorial">
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <RootPaper>
                    <Header />
                    <LineBreak />
                    <Preamble />
                    <EditChord />
                    <RemoveChord />
                    <AddChord />
                    <EditLyrics />
                    <ChordPositioning />
                    <AddLine />
                    <RemoveLine />
                    <PastingLyrics />
                    <MergeLine />
                </RootPaper>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
};

export default Tutorial;
