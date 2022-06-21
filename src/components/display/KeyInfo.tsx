import { Box, styled, Typography as UnstyledTypography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Note } from "common/music/foundation/Note";
import { MUIStyledProps } from "common/styledProps";
import React from "react";

const Typography = styled(UnstyledTypography)({
    color: grey[600],
});

interface KeyInfoProps extends MUIStyledProps {
    originalKey: Note;
    currentKey: Note;
}

const KeyInfo: React.FC<KeyInfoProps> = (props: KeyInfoProps): JSX.Element => {
    return (
        <Box className={props.className}>
            <Box>
                <Typography variant="caption">{`Key of: ${props.currentKey}`}</Typography>
            </Box>
            <Box>
                <Typography variant="caption">{`Original key: ${props.originalKey}`}</Typography>
            </Box>
        </Box>
    );
};

export default KeyInfo;

