import { createStyles } from "@material-ui/core";
import blueGrey from "@material-ui/core/colors/blueGrey";

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
