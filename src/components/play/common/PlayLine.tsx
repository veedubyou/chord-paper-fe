import { Box, styled, Typography } from "@mui/material";
import React from "react";
import { ChordBlock } from "../../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../../common/ChordModel/ChordLine";
import {
    sectionLabelStyle,
    sectionTypographyVariant,
} from "../../display/SectionLabel";
import PlayBlock from "./PlayBlock";

const LabelTypography = styled(Typography)({ ...sectionLabelStyle });
const TopMarginBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

interface PlayLineProps {
    chordLine: ChordLine;
}

const PlayLine: React.FC<PlayLineProps> = (
    props: PlayLineProps
): JSX.Element => {
    let lineComponent: React.ReactElement = (
        <Box>
            {props.chordLine.chordBlocks.list.map((block: ChordBlock) => (
                <PlayBlock block={block} key={block.id}></PlayBlock>
            ))}
        </Box>
    );

    const label = props.chordLine.section?.name;
    if (label !== undefined && label !== "") {
        const labelElement = (
            <TopMarginBox>
                <LabelTypography variant={sectionTypographyVariant}>
                    {label}
                </LabelTypography>
            </TopMarginBox>
        );

        lineComponent = (
            <Box>
                {labelElement}
                {lineComponent}
            </Box>
        );
    }

    return lineComponent;
};

export default React.memo(PlayLine);
