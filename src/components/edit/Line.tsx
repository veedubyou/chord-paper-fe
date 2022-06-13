import UnstyledBackspaceIcon from "@mui/icons-material/Backspace";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Box, Slide, styled } from "@mui/material";
import { red } from "@mui/material/colors";
import { ChordBlock } from "common/ChordModel/ChordBlock";
import { ChordLine } from "common/ChordModel/ChordLine";
import { Collection, IDable } from "common/ChordModel/Collection";
import { Lyric } from "common/ChordModel/Lyric";
import { DataTestID } from "common/DataTestID";
import { PlainFn } from "common/PlainFn";
import Block from "components/edit/Block";
import LineWithHoverMenu, { MenuItem } from "components/edit/LineWithHoverMenu";
import LineWithLyricInput from "components/edit/LineWithLyricInput";
import LineWithSection from "components/edit/LineWithSection";
import { ChordSongAction } from "components/reducer/reducer";
import { List } from "immutable";
import React, { useMemo, useState } from "react";

const AtomicSelectionBox = styled(Box)({
    userSelect: "all",
});

const BackspaceIcon = styled(UnstyledBackspaceIcon)({
    color: red[300],
});

const HighlightableBox = styled(Box)({
    "&:hover": {
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.05) 0 0)",
    },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
});

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
            />
        )
    );

    const basicLine = (startEdit: PlainFn) => (
        <HighlightableBox data-testid="NoneditableLine" onClick={startEdit}>
            {blocks}
        </HighlightableBox>
    );

    const withHoverMenu = (startEdit: PlainFn, menuItems: MenuItem[]) => (
        <LineWithHoverMenu menuItems={menuItems}>
            {basicLine(startEdit)}
        </LineWithHoverMenu>
    );

    const withLyricInput = (menuItems: MenuItem[]) => (
        <LineWithLyricInput chordLine={chordLine} songDispatch={songDispatch}>
            {(startEdit: PlainFn) => withHoverMenu(startEdit, menuItems)}
        </LineWithLyricInput>
    );

    const withSection = (
        <LineWithSection chordLine={chordLine} songDispatch={songDispatch}>
            {(editLabel: PlainFn) => {
                const menuItems: MenuItem[] = [
                    {
                        onClick: editLabel,
                        icon: <BookmarkBorderOutlinedIcon />,
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
        </LineWithSection>
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
