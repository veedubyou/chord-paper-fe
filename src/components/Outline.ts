import { Theme } from "@material-ui/core";

export const outline = (theme: Theme) => ({
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "0.3em",
    borderWidth: "0.075em",
});
