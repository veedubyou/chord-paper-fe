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
            {props.chordLine.chordBlocks.map((block: ChordBlock) => (
                <PlayBlock block={block}></PlayBlock>
            ))}
        </Box>
    );

    if (props.chordLine.label !== undefined && props.chordLine.label !== "") {
        const label = (
            <TopMarginBox>
                <LabelTypography variant={sectionTypographyVariant}>
                    {props.chordLine.label}
                </LabelTypography>
            </TopMarginBox>
        );

        lineComponent = (
            <Box display="inline-block">
                {label}
                {lineComponent}
            </Box>
        );
    }

    return lineComponent;
};

export default PlayLine;
