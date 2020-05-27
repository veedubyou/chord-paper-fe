import {
    Box,
    ButtonGroup,
    Tooltip as UnstyledTooltop,
    Typography,
    withStyles,
    Button as UnstyledButton,
    Theme,
    Slide,
} from "@material-ui/core";
import React, { useState } from "react";
import EditingLine from "./EditingLine";

import UnstyledEditIcon from "@material-ui/icons/Edit";
import UnstyledAddIcon from "@material-ui/icons/Add";
import UnstyledRemoveIcon from "@material-ui/icons/Remove";

import grey from "@material-ui/core/colors/grey";

interface LineProps {
    id: string;
    text: string;
    onChange?: (id: string, newValue: string) => void;
    onAdd?: (id: string) => void;
    onRemove?: (id: string) => void;
}

const iconColorStyle = {
    root: {
        color: "white",
    },
};

const EditIcon = withStyles(iconColorStyle)(UnstyledEditIcon);
const AddIcon = withStyles(iconColorStyle)(UnstyledAddIcon);
const RemoveIcon = withStyles(iconColorStyle)(UnstyledRemoveIcon);

const Button = withStyles((theme: Theme) => ({
    contained: {
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))(UnstyledButton);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
    },
})(UnstyledTooltop);

const HighlightableLine = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.secondary.main,
            backgroundColor: grey[100],
        },
    },
}))(Typography);

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [removed, setRemoved] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = () => {
        setEditing(false);
    };

    const addHandler = () => {
        if (props.onAdd) {
            props.onAdd(props.id);
        }
    };

    const removeHandler = () => {
        setRemoved(true);

        setTimeout(() => {
            if (props.onRemove) {
                props.onRemove(props.id);
            }
        }, 250);
    };

    const changeHandler = (): ((newValue: string) => void) => {
        return (newValue: string) => {
            if (props.onChange) {
                props.onChange(props.id, newValue);
            }
        };
    };

    const hoverMenu = (): React.ReactElement => {
        return (
            <ButtonGroup variant="outlined">
                <Button variant="contained" onClick={startEdit}>
                    <EditIcon />
                </Button>
                <Button variant="contained" onClick={addHandler}>
                    <AddIcon />
                </Button>
                <Button variant="contained" onClick={removeHandler}>
                    <RemoveIcon />
                </Button>
            </ButtonGroup>
        );
    };

    const nonEditableLine = (): React.ReactElement => {
        let text = props.text;
        if (text.trim() === "") {
            text = "\u00A0"; //white space to prevent the line being deflated
        }

        return (
            <Tooltip title={hoverMenu()} interactive>
                <HighlightableLine variant="h5" noWrap>
                    {text}
                </HighlightableLine>
            </Tooltip>
        );
    };

    let elem: React.ReactElement;
    if (!editing) {
        elem = nonEditableLine();
    } else {
        elem = (
            <EditingLine
                text={props.text}
                onChange={changeHandler()}
                onFinish={finishEdit}
            />
        );
    }

    const yeetDirection = removed ? "up" : "down";

    return (
        <Slide direction={yeetDirection} in={!removed}>
            <Box
                borderBottom={1}
                borderColor="grey.50"
                width="auto"
                margin={"3rem"}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
