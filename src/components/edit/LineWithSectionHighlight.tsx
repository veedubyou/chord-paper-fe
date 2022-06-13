import { Box } from "@mui/material";
import { alpha } from "@mui/system";
import { PlayerSectionContext } from "components/PlayerSectionContext";
import React, { useContext } from "react";

export interface LineWithSectionHighlightProps {
    children: React.ReactElement | React.ReactElement[];
    sectionID: string | null;
}

const LineWithSectionHighlight: React.FC<LineWithSectionHighlightProps> = (
    props: LineWithSectionHighlightProps
): JSX.Element => {
    const currentSectionID = useContext(PlayerSectionContext);

    if (currentSectionID !== props.sectionID) {
        return <Box>{props.children}</Box>;
    }

    return (
        <Box
            sx={(theme) => ({
                backgroundColor: alpha(theme.palette.primary.dark, 0.1),
            })}
        >
            {props.children}
        </Box>
    );
};

export default LineWithSectionHighlight;

