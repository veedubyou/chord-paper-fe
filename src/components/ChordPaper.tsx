import React, { useState } from "react";
import { Paper as UnstyledPaper, Theme, withStyles } from "@material-ui/core";
import shortid from "shortid";
import Line from "./Line";

const Paper = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(5),
        width: "max-content",
    },
}))(UnstyledPaper);

type ChordLyricLine = {
    id: string;
    lyric: string; //TODO: this will be an array of tokens
};

interface ChordPaperProps {
    initialLyrics: string[];
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): React.ReactElement => {
    const [lines, setLines] = useState<ChordLyricLine[]>([]);
    const [initial, setInitial] = useState(true);

    const setInitialLyrics = () => {
        const lines: ChordLyricLine[] = props.initialLyrics.map(
            (lyricStr: string): ChordLyricLine => {
                return {
                    id: shortid.generate(),
                    lyric: lyricStr,
                };
            }
        );

        setLines(lines);
        setInitial(false);
    };

    const addLine = (id: string) => {
        const index = lines.findIndex((line: ChordLyricLine) => line.id === id);
        let newLines = lines.slice(0, index + 1);
        newLines.push({
            id: shortid.generate(),
            lyric: "",
        });

        newLines = newLines.concat(lines.slice(index + 1));

        setLines(newLines);
    };

    const removeLine = (id: string) => {
        const newLines = lines.filter((line: ChordLyricLine) => line.id !== id);
        setLines(newLines);
    };

    const changeLine = (id: string, newLyric: string) => {
        const index = lines.findIndex((line: ChordLyricLine) => line.id === id);
        let newLines = lines.slice(0, index);
        newLines.push({
            id: id,
            lyric: newLyric,
        });

        newLines = newLines.concat(lines.slice(index + 1));

        setLines(newLines);
    };

    if (initial) {
        setInitialLyrics();
    }

    return (
        <Paper elevation={0}>
            {lines.map((line: ChordLyricLine, index: number) => (
                <Line
                    id={line.id}
                    key={line.id}
                    text={line.lyric}
                    onAdd={addLine}
                    onRemove={removeLine}
                    onChange={changeLine}
                    data-testid={`Line-${index}`}
                ></Line>
            ))}
        </Paper>
    );
};

export default ChordPaper;
