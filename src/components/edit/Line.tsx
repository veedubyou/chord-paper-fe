import { Box, Slide, withStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import ChatBubbleIcon from "@material-ui/icons/ChatBubbleOutline";
import React, { useCallback, useMemo, useState } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { Lyric } from "../../common/ChordModel/Lyric";
import { DataTestID } from "../../common/DataTestID";
import { PlainFn } from "../../common/PlainFn";
import { ChordSongAction } from "../reducer/reducer";
import Block from "./Block";
import WithHoverMenu, { MenuItem } from "./WithHoverMenu";
import WithLyricInput from "./WithLyricInput";
import WithSection from "./WithSection";

const AtomicSelectionBox = withStyles({
    root: {
        userSelect: "all",
    },
})(Box);

const BackspaceIcon = withStyles({
    root: {
        color: red[300],
    },
})(UnstyledBackspaceIcon);

const HighlightableBox = withStyles({
    root: {
        "&:hover": {
            backgroundColor: grey[100],
        },
    },
})(Box);

interface LineProps extends DataTestID {
    chordLine: ChordLine;
    songDispatch: React.Dispatch<ChordSongAction>;
    "data-lineid": string;
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [removed, setRemoved] = useState(false);
    const removalTime = 250;
    const { chordLine, songDispatch } = props;

    const handlers = {
        chordChange: useCallback(
            (blockID: IDable<ChordBlock>, newChord: string) => {
                songDispatch({
                    type: "change-chord",
                    lineID: chordLine,
                    blockID: blockID,
                    newChord: newChord,
                });
            },
            [chordLine, songDispatch]
        ),
        blockSplit: useCallback(
            (blockID: IDable<ChordBlock>, splitIndex: number) => {
                songDispatch({
                    type: "split-block",
                    lineID: chordLine,
                    blockID: blockID,
                    splitIndex: splitIndex,
                });
            },
            [chordLine, songDispatch]
        ),
        remove: useCallback(() => {
            if (removed) {
                return;
            }

            setRemoved(true);

            setTimeout(() => {
                songDispatch({
                    type: "remove-line",
                    lineID: chordLine,
                });
            }, removalTime);
        }, [chordLine, songDispatch, removed]),
    };

    let chordBlocks: ChordBlock[] = props.chordLine.chordBlocks;
    if (chordBlocks.length === 0) {
        chordBlocks = [
            new ChordBlock({
                chord: "",
                lyric: new Lyric(""),
            }),
        ];
    }

    const blocks: React.ReactElement[] = useMemo(
        () =>
            chordBlocks.map((chordBlock: ChordBlock, index: number) => (
                <Block
                    key={chordBlock.id}
                    chordBlock={chordBlock}
                    songDispatch={songDispatch}
                    onChordChange={handlers.chordChange}
                    onBlockSplit={handlers.blockSplit}
                    data-testid={`Block-${index}`}
                ></Block>
            )),
        [chordBlocks, songDispatch, handlers.blockSplit, handlers.chordChange]
    );

    const basicLine = useCallback(
        (startEdit: PlainFn) => (
            <HighlightableBox
                data-testid={"NoneditableLine"}
                onClick={startEdit}
            >
                {blocks}
            </HighlightableBox>
        ),
        [blocks]
    );

    const withHoverMenu = useCallback(
        (startEdit: PlainFn, menuItems: MenuItem[]) => (
            <WithHoverMenu menuItems={menuItems}>
                {basicLine(startEdit)}
            </WithHoverMenu>
        ),
        [basicLine]
    );

    const withLyricInput = useCallback(
        (menuItems: MenuItem[]) => (
            <WithLyricInput chordLine={chordLine} songDispatch={songDispatch}>
                {(startEdit: PlainFn) => withHoverMenu(startEdit, menuItems)}
            </WithLyricInput>
        ),
        [chordLine, songDispatch, withHoverMenu]
    );

    const withSection = (
        <WithSection chordLine={chordLine} songDispatch={songDispatch}>
            {useCallback(
                (editLabel: PlainFn) => {
                    const menuItems: MenuItem[] = [
                        {
                            onClick: editLabel,
                            icon: <ChatBubbleIcon />,
                            "data-testid": "EditLabel",
                        },
                        {
                            onClick: handlers.remove,
                            icon: <BackspaceIcon />,
                            "data-testid": "RemoveButton",
                        },
                    ];

                    return withLyricInput(menuItems);
                },
                [withLyricInput, handlers.remove]
            )}
        </WithSection>
    );

    const lineContent: React.ReactElement = withSection;
    const yeetDirection = removed ? "up" : "down";

    return (
        <Slide direction={yeetDirection} in={!removed} timeout={removalTime}>
            <AtomicSelectionBox>
                <Box
                    borderBottom={1}
                    width="100%"
                    position="relative"
                    data-lineid={props["data-lineid"]}
                    data-testid={props["data-testid"]}
                >
                    {lineContent}
                </Box>
            </AtomicSelectionBox>
        </Slide>
    );
};

export default React.memo(Line);
