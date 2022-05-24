import UnstyledAddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
    Divider as UnstyledDivider,
    Grid,
    styled,
    Theme,
    Tooltip as UnstyledTooltip
} from "@mui/material";
import { useTheme } from "@mui/styles";
import React from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { DataTestID } from "../../common/DataTestID";
import { ChordSongAction } from "../reducer/reducer";
import WithHoverMenu, { MenuItem } from "./WithHoverMenu";

const HighlightableGrid = styled(Grid)({
    "&:hover .MuiDivider-root": {
        borderColor: "rgba(0, 0, 0, 0.25)",
    },
});

const Tooltip = styled(UnstyledTooltip)({
    padding: 0,
    background: "transparent",
    margin: 0,
});

const Divider = styled(UnstyledDivider)({
    width: "100%",
    borderColor: "transparent",
});

const AddCircleOutlineIcon = styled(UnstyledAddCircleOutlineIcon)(
    ({ theme }) => ({
        color: theme.palette.secondary.light,
    })
);

interface NewLineProps extends DataTestID {
    lineID: IDable<ChordLine> | "beginning";
    songDispatch: React.Dispatch<ChordSongAction>;
}

const NewLine: React.FC<NewLineProps> = (props: NewLineProps): JSX.Element => {
    const theme: Theme = useTheme();

    const handleAddLine = () => {
        props.songDispatch({
            type: "add-line",
            lineID: props.lineID,
        });
    };

    const menuItem: MenuItem = {
        onClick: handleAddLine,
        "data-testid": "AddButton",
        icon: <AddCircleOutlineIcon />,
    };

    return (
        <WithHoverMenu menuItems={[menuItem]}>
            <HighlightableGrid
                container
                direction="column"
                justifyContent="center"
                onClick={handleAddLine}
                data-testid={props["data-testid"]}
                style={{
                    minHeight: theme.spacing(3),
                }}
            >
                <Divider />
            </HighlightableGrid>
        </WithHoverMenu>
    );
};

export default React.memo(NewLine);
