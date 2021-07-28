import {
    Grid,
    makeStyles,
    Paper as UnstyledPaper,
    withStyles,
} from "@material-ui/core";
import { List } from "immutable";
import React, { useMemo, useState } from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { ChordSongAction } from "../reducer/reducer";
import { handleBatchLineDelete } from "./BatchDelete";
import { useLineCopyHandler } from "./CopyAndPaste";
import { InteractionContext, InteractionSetter } from "./InteractionContext";
import Line from "./Line";
import NewLine from "./NewLine";

const useUninteractiveStyle = makeStyles({
    root: {
        pointerEvents: "none",
    },
});

const Paper = withStyles({
    root: {
        width: "auto",
    },
})(UnstyledPaper);

interface ChordPaperBodyProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
}

const ChordPaperBody: React.FC<ChordPaperBodyProps> = (
    props: ChordPaperBodyProps
): React.ReactElement => {
    const [interacting, setInteracting] = useState(false);
    const handleCopy = useLineCopyHandler(props.song);
    const songDispatch = props.songDispatch;

    const interactionContextValue: InteractionSetter = useMemo(
        () => ({
            startInteraction: () => {
                setTimeout(() => {
                    setInteracting(true);
                });
            },
            endInteraction: () => {
                setTimeout(() => {
                    setInteracting(false);
                });
            },
        }),
        []
    );

    const uninteractiveStyle = useUninteractiveStyle();

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
        const lineIDs = handleBatchLineDelete(event);
        if (lineIDs === false) {
            return;
        }

        songDispatch({
            type: "batch-remove-lines",
            lineIDs: lineIDs,
        });
    };

    const lines: List<JSX.Element> = (() => {
        let lines = props.song.chordLines.list.flatMap((line: ChordLine) => {
            return [
                <Line
                    key={line.id}
                    chordLine={line}
                    songDispatch={songDispatch}
                    data-lineid={line.id}
                    data-testid="Line"
                />,
                <NewLine
                    key={"NewLine-" + line.id}
                    lineID={line}
                    songDispatch={songDispatch}
                    data-testid="NewLine"
                />,
            ];
        });

        const firstNewLine = (
            <NewLine
                key={"NewLine-Top"}
                lineID="beginning"
                songDispatch={songDispatch}
                data-testid="NewLine-Top"
            />
        );

        lines = lines.splice(0, 0, firstNewLine);

        return lines;
    })();

    // prevent other interactions if currently interacting
    const allowInteraction: boolean = !interacting;
    const paperClassName = allowInteraction
        ? undefined
        : uninteractiveStyle.root;

    return (
        <InteractionContext.Provider value={interactionContextValue}>
            <Paper
                onKeyDown={allowInteraction ? handleKeyDown : undefined}
                onCopy={allowInteraction ? handleCopy : undefined}
                className={paperClassName}
                elevation={0}
                tabIndex={0}
            >
                <Grid container justify="center">
                    <Grid item xs={10}>
                        {lines}
                    </Grid>
                </Grid>
            </Paper>
        </InteractionContext.Provider>
    );
};

export default ChordPaperBody;
