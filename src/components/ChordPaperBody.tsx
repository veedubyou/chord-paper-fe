import React from "react";
import { Paper as UnstyledPaper, Theme, withStyles } from "@material-ui/core";
import Line from "./Line";
import { ChordLine, ChordSong } from "../common/ChordModel";
import { IDable } from "../common/Collection";

const Paper = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(5),
        width: "max-content",
    },
}))(UnstyledPaper);

interface ChordPaperBodyProps {
    song: ChordSong;
    onSongChanged?: (updatedSong: ChordSong) => void;
}

const ChordPaperBody: React.FC<ChordPaperBodyProps> = (
    props: ChordPaperBodyProps
): React.ReactElement => {
    const addLine = (id: IDable<"ChordLine">) => {
        const newLine: ChordLine = new ChordLine();
        props.song.addAfter(id, newLine);
        notifySongChanged();
    };

    const removeLine = (id: IDable<"ChordLine">) => {
        props.song.remove(id);
        notifySongChanged();
    };

    const changeLine = (id: IDable<"ChordLine">) => {
        notifySongChanged();
    };

    const pasteOverflowFromLine = (
        id: IDable<"ChordLine">,
        overflowContent: string[]
    ) => {
        const newChordLines = overflowContent.map((newLyricLine: string) =>
            ChordLine.fromLyrics(newLyricLine)
        );
        props.song.addAfter(id, ...newChordLines);
        notifySongChanged();
    };

    const notifySongChanged = () => {
        if (props.onSongChanged) {
            props.onSongChanged(props.song);
        }
    };

    return (
        <Paper elevation={0}>
            {props.song.chordLines.map((line: ChordLine, index: number) => {
                return (
                    <Line
                        key={line.id}
                        chordLine={line}
                        onAddLine={addLine}
                        onRemoveLine={removeLine}
                        onChangeLine={changeLine}
                        onPasteOverflow={pasteOverflowFromLine}
                        data-testid={`Line-${index}`}
                    />
                );
            })}
        </Paper>
    );
};

export default ChordPaperBody;
