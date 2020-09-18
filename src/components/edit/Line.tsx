import { Box, Slide, withStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import UnstyledBackspaceIcon from "@material-ui/icons/Backspace";
import ChatBubbleIcon from "@material-ui/icons/ChatBubbleOutline";
import React, { useState } from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { PlainFn } from "../../common/PlainFn";
import { DataTestID } from "../../common/DataTestID";
import Block, { BlockProps } from "./Block";
import WithHoverMenu, { MenuItem } from "./WithHoverMenu";
import WithLyricInput from "./WithLyricInput";
import WithSectionLabel from "./WithSectionLabel";
import { SerializedLyrics } from "../lyrics/LyricSerialization";

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
    "data-lineid": string;
    onChangeLine?: (id: IDable<ChordLine>) => void;
    onRemoveLine?: (id: IDable<ChordLine>) => void;
    onLyricOverflow?: (
        id: IDable<ChordLine>,
        overflowLyricContent: SerializedLyrics[]
    ) => void;
    onJSONPaste?: (id: IDable<ChordLine>, jsonStr: string) => boolean;
    onMergeWithPreviousLine?: (id: IDable<ChordLine>) => boolean;
    onChordDragAndDrop?: BlockProps["onChordDragAndDrop"];
}

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [removed, setRemoved] = useState(false);
    const removalTime = 250;

    const handlers = {
        chordChange: (id: IDable<ChordBlock>, newChord: string) => {
            props.chordLine.setChord(id, newChord);
            props.onChangeLine?.(props.chordLine);
        },
        blockSplit: (id: IDable<ChordBlock>, splitIndex: number) => {
            props.chordLine.splitBlock(id, splitIndex);
            props.onChangeLine?.(props.chordLine);
        },
        remove: () => {
            if (removed) {
                return;
            }

            setRemoved(true);

            if (props.onRemoveLine) {
                setTimeout(() => {
                    if (props.onRemoveLine) {
                        props.onRemoveLine(props.chordLine);
                    }
                }, removalTime);
            }
        },
    };

    let chordBlocks: ChordBlock[] = props.chordLine.chordBlocks;
    if (chordBlocks.length === 0) {
        chordBlocks = [
            new ChordBlock({
                chord: "",
                lyric: { serializedLyrics: "" },
            }),
        ];
    }

    const blocks: React.ReactElement[] = chordBlocks.map(
        (chordBlock: ChordBlock, index: number) => (
            <Block
                key={chordBlock.id}
                chordBlock={chordBlock}
                onChordDragAndDrop={props.onChordDragAndDrop}
                onChordChange={handlers.chordChange}
                onBlockSplit={handlers.blockSplit}
                data-testid={`Block-${index}`}
            ></Block>
        )
    );

    const basicLine = (startEdit: PlainFn) => (
        <HighlightableBox data-testid={"NoneditableLine"} onClick={startEdit}>
            {blocks}
        </HighlightableBox>
    );

    const withHoverMenu = (startEdit: PlainFn, menuItems: MenuItem[]) => (
        <WithHoverMenu menuItems={menuItems}>
            {basicLine(startEdit)}
        </WithHoverMenu>
    );

    const withLyricInput = (menuItems: MenuItem[]) => (
        <WithLyricInput
            chordLine={props.chordLine}
            onChangeLine={props.onChangeLine}
            onJSONPaste={props.onJSONPaste}
            onMergeWithPreviousLine={props.onMergeWithPreviousLine}
            onLyricOverflow={props.onLyricOverflow}
        >
            {(startEdit: PlainFn) => withHoverMenu(startEdit, menuItems)}
        </WithLyricInput>
    );

    const withSectionLabel = (
        <WithSectionLabel
            chordLine={props.chordLine}
            onChangeLabel={props.onChangeLine}
        >
            {(editLabel: PlainFn) => {
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
            }}
        </WithSectionLabel>
    );

    const lineContent: React.ReactElement = withSectionLabel;
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

export default Line;
