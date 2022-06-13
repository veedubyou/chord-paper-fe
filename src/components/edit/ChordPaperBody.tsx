import { Grid, Paper as UnstyledPaper, styled, Theme } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { ChordLine } from "common/ChordModel/ChordLine";
import { ChordSong } from "common/ChordModel/ChordSong";
import { handleBatchLineDelete } from "components/edit/BatchDelete";
import { useLineCopyHandler } from "components/edit/CopyAndPaste";
import LineWithSectionHighlight from "components/edit/LineWithSectionHighlight";
import {
    InteractionContext,
    InteractionSetter,
} from "components/edit/InteractionContext";
import Line from "components/edit/Line";
import NewLine from "components/edit/NewLine";
import { handleUndoRedo } from "components/edit/Undo";
import { useRegisterKeyListener } from "components/GlobalKeyListener";
import { ChordSongAction } from "components/reducer/reducer";
import { List } from "immutable";
import React, { useEffect, useMemo, useState } from "react";

const uninteractiveSx: SystemStyleObject<Theme> = {
    pointerEvents: "none",
};

const Paper = styled(UnstyledPaper)({
    width: "auto",
});

type KeyDownHandler = (
    event: KeyboardEvent,
    songDispatch: React.Dispatch<ChordSongAction>
) => boolean;

interface ChordPaperBodyProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
}

const ChordPaperBody: React.FC<ChordPaperBodyProps> = (
    props: ChordPaperBodyProps
): React.ReactElement => {
    const [interacting, setInteracting] = useState(false);
    const handleCopy = useLineCopyHandler(props.song);
    const [addKeyListener, removeKeyListener] = useRegisterKeyListener();

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

    // prevent other interactions if currently interacting
    const allowInteraction: boolean = !interacting;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (!allowInteraction) {
                return;
            }

            const handlers: KeyDownHandler[] = [
                handleBatchLineDelete,
                handleUndoRedo,
            ];

            for (const handler of handlers) {
                const handled = handler(event, songDispatch);
                if (handled) {
                    event.preventDefault();
                    return;
                }
            }
        };

        addKeyListener(handleKeyDown);

        return () => removeKeyListener(handleKeyDown);
    }, [allowInteraction, addKeyListener, removeKeyListener, songDispatch]);

    const makeLineElements = (
        line: ChordLine,
        sectionID: string,
        index: number,
        listSize: number
    ): React.ReactElement => {
        const isTop = index === 0;
        const isBottom = index === listSize - 1;

        return (
            <LineWithSectionHighlight
                key={line.id}
                sectionID={sectionID}
                top={isTop}
                bottom={isBottom}
            >
                <Line
                    key={line.id}
                    chordLine={line}
                    songDispatch={songDispatch}
                    data-lineid={line.id}
                    data-testid="Line"
                />
                <NewLine
                    key={`NewLine-${line.id}`}
                    lineID={line}
                    songDispatch={songDispatch}
                    data-testid="NewLine"
                />
            </LineWithSectionHighlight>
        );
    };

    const lines: List<JSX.Element> = (() => {
        let lines = props.song.timeSectionedChordLines.flatMap(
            (section: List<ChordLine>) => {
                const sectionID = section.get(0)?.id;
                if (sectionID === undefined) {
                    throw new Error(
                        "Sections are expected to have at least one line"
                    );
                }

                return section.map((line: ChordLine, index: number) =>
                    makeLineElements(line, sectionID, index, section.size)
                );
            }
        );

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

    const paperSx = allowInteraction ? undefined : uninteractiveSx;

    return (
        <InteractionContext.Provider value={interactionContextValue}>
            <Paper
                onCopy={allowInteraction ? handleCopy : undefined}
                sx={paperSx}
                elevation={0}
                tabIndex={0}
            >
                <Grid container justifyContent="center">
                    <Grid item xs={10}>
                        {lines}
                    </Grid>
                </Grid>
            </Paper>
        </InteractionContext.Provider>
    );
};

export default ChordPaperBody;
