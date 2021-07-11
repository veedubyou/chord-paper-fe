import { Box, Typography, Theme } from "@material-ui/core";
import React from "react";
import { ChordBlock } from "../../common/ChordModel/ChordBlock";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import PlayBlock from "./PlayBlock";
import { withStyles } from "@material-ui/styles";
import {
    sectionLabelStyle,
    sectionTypographyVariant,
} from "../display/SectionLabel";

const LabelTypography = withStyles(sectionLabelStyle)(Typography);
const TopMarginBox = withStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(1),
    },
}))(Box);

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

export default PlayLine;
