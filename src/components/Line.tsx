import {
    Box,
    ButtonGroup,
    Tooltip as UnstyledTooltop,
    Typography,
    withStyles,
    Button as UnstyledButton,
    Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import EditingLine from "./EditingLine";

import UnstyledEditIcon from "@material-ui/icons/Edit";
import UnstyledAddIcon from "@material-ui/icons/Add";
import UnstyledRemoveIcon from "@material-ui/icons/Remove";

import grey from "@material-ui/core/colors/grey";

type OnChangeFn = (newValue: string) => void;

interface LineProps {
    text: string;
    onChange?: OnChangeFn;
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
    },
}))(UnstyledButton);

const Tooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: theme.palette.primary.main,
    },
}))(UnstyledTooltop);

const HighlightableLine = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.primary.dark,
            backgroundColor: grey[100],
        },
    },
}))(Typography);

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = () => {
        setEditing(false);
    };

    const hoverMenu = (): React.ReactElement => {
        return (
            <ButtonGroup variant="outlined">
                <Button
                    variant="contained"
                    onClick={startEdit}
                    disableElevation
                >
                    <EditIcon />
                </Button>
                <Button variant="contained" disableElevation>
                    <AddIcon />
                </Button>
                <Button variant="contained" disableElevation>
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
                onChange={props.onChange}
                onFinish={finishEdit}
            />
        );
    }

    return (
        <Box
            borderBottom={1}
            borderColor="grey.50"
            width="auto"
            margin={"3rem"}
        >
            {elem}
        </Box>
    );
};

export default Line;
