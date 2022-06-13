import UnstyledAddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Divider as UnstyledDivider, Grid, styled } from "@mui/material";
import { ChordLine } from "common/ChordModel/ChordLine";
import { IDable } from "common/ChordModel/Collection";
import { DataTestID } from "common/DataTestID";
import LineWithHoverMenu, { MenuItem } from "components/edit/LineWithHoverMenu";
import { ChordSongAction } from "components/reducer/reducer";
import React from "react";

const HighlightableGrid = styled(Grid)(({ theme }) => ({
    minHeight: theme.spacing(3),
    "&:hover .MuiDivider-root": {
        borderColor: "rgba(0, 0, 0, 0.25)",
    },
}));

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
        <LineWithHoverMenu menuItems={[menuItem]}>
            <HighlightableGrid
                container
                direction="column"
                justifyContent="center"
                onClick={handleAddLine}
                data-testid={props["data-testid"]}
            >
                <Divider />
            </HighlightableGrid>
        </LineWithHoverMenu>
    );
};

export default React.memo(NewLine);
