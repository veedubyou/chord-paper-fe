import React, { useState } from "react";
import { Paper as UnstyledPaper, Theme, withStyles } from "@material-ui/core";
import Line from "./Line";
import { ChordLine, ChordSong } from "../common/ChordModels";
import { IDable } from "../common/Collection";

const Paper = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(5),
        width: "max-content",
    },
}))(UnstyledPaper);

interface ChordPaperProps {
    initialSong: ChordSong;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): React.ReactElement => {
    const [song, setSong] = useState<ChordSong>(props.initialSong);

    const addLine = (id: IDable<"ChordLine">) => {
        const newLine: ChordLine = new ChordLine();
        song.addAfter(id, newLine);
        setSong(song.clone());
    };

    const removeLine = (id: IDable<"ChordLine">) => {
        song.remove(id);
        setSong(song.clone());
    };

    const changeLine = (id: IDable<"ChordLine">) => {
        // don't need to adjust any data structures as it's done by the Line
        // but do set the state to trigger a rerender since Line doesn't have any state
        setSong(song.clone());
    };

    return (
        <Paper elevation={0}>
            {song.chordLines.map((line: ChordLine, index: number) => {
                return (
                    <Line
                        key={line.id}
                        chordLine={line}
                        onAddLine={addLine}
                        onRemoveLine={removeLine}
                        onChangeLine={changeLine}
                        data-testid={`Line-${index}`}
                    />
                );
            })}
        </Paper>
    );
};

export default ChordPaper;
