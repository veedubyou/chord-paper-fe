import { Box } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import PlayBlock from "./PlayBlock";

interface PlayLineProps {
    line: ChordLine;
}

const PlayLine: React.FC<PlayLineProps> = (
    props: PlayLineProps
): JSX.Element => {
    return (
        <Box>
            {props.line.chordBlocks.map((block: ChordBlock) => (
                <PlayBlock block={block}></PlayBlock>
            ))}
        </Box>
    );
};

export default PlayLine;
