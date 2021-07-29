import { Box, Slide, withStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import ChatBubbleIcon from "@material-ui/icons/ChatBubbleOutline";
import { List } from "immutable";
import React, { useMemo, useState } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { Collection, IDable } from "../../common/ChordModel/Collection";
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
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
})(Box);

interface LineProps extends DataTestID {
    chordLine: ChordLine;
    songDispatch: React.Dispatch<ChordSongAction>;
    "data-lineid": string;
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [removing, setRemoving] = useState(false);
    const { chordLine, songDispatch } = props;

    const handlers = useMemo(
        () => ({
            chordChange: (blockID: IDable<ChordBlock>, newChord: string) => {
                songDispatch({
                    type: "set-chord",
                    lineID: chordLine,
                    blockID: blockID,
                    newChord: newChord,
                });
            },
            blockSplit: (blockID: IDable<ChordBlock>, splitIndex: number) => {
                songDispatch({
                    type: "split-block",
                    lineID: chordLine,
                    blockID: blockID,
                    splitIndex: splitIndex,
                });
            },

            startRemove: () => {
                setRemoving(true);
            },

            remove: () => {
                songDispatch({
                    type: "remove-line",
                    lineID: chordLine,
                });
            },
        }),
        [chordLine, songDispatch]
    );

    let chordBlocks: Collection<ChordBlock> = props.chordLine.chordBlocks;
    if (chordBlocks.length === 0) {
        chordBlocks = new Collection([
            new ChordBlock({
                chord: "",
                lyric: new Lyric(""),
            }),
        ]);
    }

    const blocks: List<React.ReactElement> = chordBlocks.list.map(
        (chordBlock: ChordBlock): React.ReactElement => (
            <Block
                key={chordBlock.id}
                chordBlock={chordBlock}
                songDispatch={songDispatch}
                onChordChange={handlers.chordChange}
                onBlockSplit={handlers.blockSplit}
                data-testid="Block"
            ></Block>
        )
    );

    const basicLine = (startEdit: PlainFn) => (
        <HighlightableBox data-testid="NoneditableLine" onClick={startEdit}>
            {blocks}
        </HighlightableBox>
    );

    const withHoverMenu = (startEdit: PlainFn, menuItems: MenuItem[]) => (
        <WithHoverMenu menuItems={menuItems}>
            {basicLine(startEdit)}
        </WithHoverMenu>
    );

    const withLyricInput = (menuItems: MenuItem[]) => (
        <WithLyricInput chordLine={chordLine} songDispatch={songDispatch}>
            {(startEdit: PlainFn) => withHoverMenu(startEdit, menuItems)}
        </WithLyricInput>
    );

    const withSection = (
        <WithSection chordLine={chordLine} songDispatch={songDispatch}>
            {(editLabel: PlainFn) => {
                const menuItems: MenuItem[] = [
                    {
                        onClick: editLabel,
                        icon: <ChatBubbleIcon />,
                        "data-testid": "EditLabel",
                    },
                    {
                        onClick: handlers.startRemove,
                        icon: <BackspaceIcon />,
                        "data-testid": "RemoveButton",
                    },
                ];

                return withLyricInput(menuItems);
            }}
        </WithSection>
    );

    const lineContent: React.ReactElement = withSection;
    const yeetDirection = removing ? "up" : "down";

    return (
        <Slide
            direction={yeetDirection}
            in={!removing}
            timeout={250}
            onExited={handlers.remove}
        >
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
