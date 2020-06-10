import React from "react";
import {
    Typography,
    Theme,
    Grid,
    Tooltip as UnstyledTooltip,
    Divider as UnstyledDivider,
    Button,
} from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/styles";
import EditableTypography from "./EditableTypography";
import { ChordSong } from "../common/ChordModel/ChordSong";
import UnstyledAddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { ChordLine } from "../common/ChordModel/ChordLine";
import { DataTestID } from "../common/DataTestID";

const HighlightableGrid = withStyles({
    root: {
        "&:hover .MuiDivider-root": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
        },
    },
})(Grid);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
        background: "transparent",
    },
})(UnstyledTooltip);

const Divider = withStyles({
    root: {
        width: "100%",
        backgroundColor: "transparent",
    },
})(UnstyledDivider);

const AddCircleOutlineIcon = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.primary.main,
    },
}))(UnstyledAddCircleOutlineIcon);

interface NewLineProps extends DataTestID {
    onAdd?: () => void;
}

const NewLine: React.FC<NewLineProps> = (props: NewLineProps): JSX.Element => {
    const theme: Theme = useTheme();

    const hoverMenu = (): React.ReactElement => {
        return (
            <Button data-testid={"AddButton"} onClick={props.onAdd}>
                <AddCircleOutlineIcon />
            </Button>
        );
    };

    return (
        <Tooltip title={hoverMenu()} interactive placement="right">
            <HighlightableGrid
                container
                direction="column"
                justify="center"
                onClick={props.onAdd}
                data-testid={props["data-testid"]}
                style={{
                    minHeight: theme.spacing(3),
                }}
            >
                <Divider />
            </HighlightableGrid>
        </Tooltip>
    );
};

export default NewLine;
