import { Theme } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import TransposeIcon from "@material-ui/icons/ImportExport";
import PlayIcon from "@material-ui/icons/PlayArrow";
import SaveIcon from "@material-ui/icons/Save";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import { useCloudCreateSong } from "./cloudSave";
import { useLoadMenuAction } from "./load";
import { useSaveMenuAction } from "./save";
import TransposeMenu from "./TransposeMenu";
import useKonamiCode from "react-use-konami";
import { UserContext } from "../../user/userContext";

interface ChordPaperMenuProps {
    song: ChordSong;
    onSongChanged: (song: ChordSong) => void;
    onPlay?: PlainFn;
}

const SpeedDial = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}))(UnstyledSpeedDial);

const ChordPaperMenu: React.FC<ChordPaperMenuProps> = (
    props: ChordPaperMenuProps
): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [transposeMenuOpen, setTransposeMenuOpen] = useState(false);
    const [offlineMode, setOfflineMode] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const user = React.useContext(UserContext);
    const loadAction = useLoadMenuAction(props.onSongChanged, enqueueSnackbar);
    const saveAction = useSaveMenuAction(props.song);
    const cloudSaveAction = useCloudCreateSong(props.song);

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    useKonamiCode(() => {
        setOfflineMode(true);
        enqueueSnackbar("Local save and load buttons are enabled!", {
            variant: "info",
        });
    });

    if (transposeMenuOpen) {
        return (
            <TransposeMenu
                song={props.song}
                open
                onClose={() => {
                    setTransposeMenuOpen(false);
                }}
                onSongChanged={props.onSongChanged}
            ></TransposeMenu>
        );
    }

    return (
        <SpeedDial
            icon={<SpeedDialIcon />}
            open={open}
            onOpen={openMenu}
            onClose={closeMenu}
            ariaLabel="SpeedDial"
        >
            {offlineMode && (
                <SpeedDialAction
                    icon={<FolderOpenIcon />}
                    tooltipTitle="Load from computer"
                    onClick={loadAction}
                />
            )}
            {offlineMode && (
                <SpeedDialAction
                    icon={<SaveIcon />}
                    tooltipTitle="Save to computer"
                    onClick={saveAction}
                />
            )}
            <SpeedDialAction
                icon={<TransposeIcon />}
                tooltipTitle="Transpose"
                onClick={() => {
                    setTransposeMenuOpen(true);
                }}
            />
            {props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<CloudUploadIcon />}
                    tooltipTitle="Save to Cloud"
                    onClick={() => cloudSaveAction(user)}
                />
            )}
            <SpeedDialAction
                icon={<PlayIcon />}
                tooltipTitle="Play Mode"
                onClick={props.onPlay}
            />
        </SpeedDial>
    );
};

export default ChordPaperMenu;
