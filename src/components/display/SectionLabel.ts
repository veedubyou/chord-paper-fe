import createStyles from '@mui/styles/createStyles';
import { blueGrey } from '@mui/material/colors';

export const sectionLabelStyle = createStyles({
    root: {
        borderColor: blueGrey[500],
        borderStyle: "solid",
        borderRadius: "0.3em",
        borderWidth: "0.075em",
        color: blueGrey[500],
        display: "inline-block",
    },
});

export const sectionTypographyVariant: "body2" = "body2";
