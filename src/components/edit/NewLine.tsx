import {
    Button,
    Divider as UnstyledDivider,
    Grid,
    Theme,
    Tooltip as UnstyledTooltip,
} from "@material-ui/core";
import UnstyledAddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useTheme, withStyles } from "@material-ui/styles";
import React from "react";
import { DataTestID } from "../../common/DataTestID";

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
        margin: 0,
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
        color: theme.palette.secondary.light,
    },
}))(UnstyledAddCircleOutlineIcon);

interface NewLineProps extends DataTestID {
    onAdd?: () => void;
    interactive: boolean;
}

const NewLine: React.FC<NewLineProps> = (props: NewLineProps): JSX.Element => {
    const theme: Theme = useTheme();

    const hoverMenu = (): React.ReactElement | string => {
        if (!props.interactive) {
            return "";
        }

        return (
            <Button data-testid={"AddButton"} onClick={props.onAdd}>
                <AddCircleOutlineIcon />
            </Button>
        );
    };

    const handleClick = (): (() => void) | undefined => {
        if (!props.interactive) {
            return undefined;
        }

        return props.onAdd;
    };

    return (
        <Tooltip title={hoverMenu()} interactive placement="right">
            <HighlightableGrid
                container
                direction="column"
                justify="center"
                onClick={handleClick()}
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
