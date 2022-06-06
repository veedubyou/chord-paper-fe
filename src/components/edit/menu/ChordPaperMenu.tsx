import ForkIcon from "@mui/icons-material/CallSplit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TransposeIcon from "@mui/icons-material/ImportExport";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
    styled
} from "@mui/material";
import { ChordSong } from "common/ChordModel/ChordSong";
import { PlainFn } from "common/PlainFn";
import { useCloudCreateSong, useCloudDeleteSongDialog } from "components/edit/menu/cloudSave";
import { useLoadMenuAction } from "components/edit/menu/load";
import { useSaveMenuAction } from "components/edit/menu/save";
import TransposeMenu from "components/edit/menu/TransposeMenu";
import { ChordSongAction } from "components/reducer/reducer";
import { User, UserContext } from "components/user/userContext";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import useKonamiCode from "react-use-konami";

interface ChordPaperMenuProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
    onPlay?: PlainFn;
}

const SpeedDial = styled(UnstyledSpeedDial)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(3),
    right: theme.spacing(2),
}));

const ChordPaperMenu: React.FC<ChordPaperMenuProps> = (
    props: ChordPaperMenuProps
): JSX.Element => {
    const developmentEnv = process.env.NODE_ENV === "development";
    const [open, setOpen] = useState(false);
    const [transposeMenuOpen, setTransposeMenuOpen] = useState(false);
    const [offlineMode, setOfflineMode] = useState(developmentEnv);
    const { enqueueSnackbar } = useSnackbar();

    const user = React.useContext(UserContext);

    const setSong = (loadedSong: ChordSong) =>
        props.songDispatch({ type: "replace-song", newSong: loadedSong });
    const loadAction = useLoadMenuAction(setSong, enqueueSnackbar);
    const saveAction = useSaveMenuAction(props.song);
    const cloudSaveAction = useCloudCreateSong();
    const [showDeleteDialog, deleteDialog] = useCloudDeleteSongDialog(
        props.song,
        user
    );

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const forkSong = (song: ChordSong, user: User) => {
        const songClone = song.fork();
        cloudSaveAction(songClone, user);
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
                songDispatch={props.songDispatch}
                open
                onClose={() => {
                    setTransposeMenuOpen(false);
                }}
            ></TransposeMenu>
        );
    }

    if (deleteDialog !== null) {
        return deleteDialog;
    }

    return (
        <SpeedDial
            icon={<MoreVertIcon />}
            open={open}
            onOpen={openMenu}
            onClose={closeMenu}
            direction="down"
            ariaLabel="SpeedDial"
        >
            <SpeedDialAction
                icon={<PlayIcon />}
                tooltipTitle="Play Mode"
                onClick={props.onPlay}
            />

            {!props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<ForkIcon />}
                    tooltipTitle="Fork"
                    onClick={() => forkSong(props.song, user)}
                />
            )}

            {props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<CloudUploadIcon />}
                    tooltipTitle="Save to Cloud"
                    onClick={() => cloudSaveAction(props.song, user)}
                />
            )}

            <SpeedDialAction
                icon={<TransposeIcon />}
                tooltipTitle="Transpose"
                onClick={() => {
                    setTransposeMenuOpen(true);
                }}
            />

            {offlineMode && (
                <SpeedDialAction
                    icon={<SaveIcon />}
                    tooltipTitle="Save to computer"
                    onClick={saveAction}
                />
            )}

            {offlineMode && (
                <SpeedDialAction
                    icon={<FolderOpenIcon />}
                    tooltipTitle="Load from computer"
                    onClick={loadAction}
                />
            )}

            {!props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<DeleteIcon />}
                    tooltipTitle="Delete Song"
                    onClick={showDeleteDialog}
                />
            )}
        </SpeedDial>
    );
};

export default ChordPaperMenu;
