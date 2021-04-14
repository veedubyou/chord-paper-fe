import {
    Box,
    Box as UnstyledBox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    TextFieldProps as TextFieldPropsWithVariant,
    Theme,
    Typography as UnstyledTypography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/styles";
import lodash from "lodash";
import React, { useState } from "react";
import { Track, TrackList } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";
import { convertViewLinkToExportLink } from "./google_drive";

type TextFieldProps = Omit<Partial<TextFieldPropsWithVariant>, "variant">;

interface TrackListEditDialogProps {
    open: boolean;
    onClose?: PlainFn;
    trackList: TrackList;
    onSubmit?: (trackList: TrackList) => void;
}

const InlineBlockBox = withStyles({
    root: {
        display: "inline-block",
    },
})(UnstyledBox);

const AddNewRowBox = withStyles((theme: Theme) => ({
    root: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}))(UnstyledBox);

const RowContainer = withStyles((theme: Theme) => ({
    root: {
        display: "flex",
        margin: theme.spacing(2),
        alignItems: "baseline",
    },
}))(UnstyledBox);

const Typography = withStyles((theme: Theme) => ({
    root: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
}))(UnstyledTypography);

const TrackListEditDialog: React.FC<TrackListEditDialogProps> = (
    props: TrackListEditDialogProps
): JSX.Element => {
    const emptySingleTrack = (): Track => {
        return { id: "", track_type: "single", label: "", url: "" };
    };

    const initialTrackList: TrackList = (() => {
        const clone = lodash.cloneDeep(props.trackList);
        if (clone.tracks.length === 0) {
            clone.tracks.push(emptySingleTrack());
        }

        return clone;
    })();

    const [trackList, setTrackList] = useState<TrackList>(initialTrackList);
    const [version, setVersion] = useState(0);

    const bumpVersion = () => setVersion(version + 1);
    const cloneTrackList = () => lodash.cloneDeep(trackList);

    const appendTrack = () => {
        const clone = cloneTrackList();
        clone.tracks.push(emptySingleTrack());
        bumpVersion();
        setTrackList(clone);
    };

    const removeTrack = (index: number) => {
        const clone = cloneTrackList();
        clone.tracks.splice(index, 1);
        bumpVersion();
        setTrackList(clone);
    };

    const validateValue = (label: string): TextFieldProps => {
        const emptyLabel = label.trim() === "";

        return {
            error: emptyLabel ? true : undefined,
            helperText: emptyLabel ? "Can't be empty" : undefined,
        };
    };

    const hasError: boolean = (() => {
        for (let track of trackList.tracks) {
            if (validateValue(track.label).error === true) {
                return true;
            }

            if (validateValue(track.url).error === true) {
                return true;
            }
        }

        return false;
    })();

    const labelChangeHandler = (index: number) => {
        return (
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => {
            const track = trackList.tracks[index];
            const updatedTrack = { ...track, label: event.target.value };
            updateTrack(index, updatedTrack);
        };
    };

    const urlChangeHandler = (index: number) => {
        return (
            event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => {
            const track = trackList.tracks[index];
            const updatedTrack = { ...track, url: event.target.value };
            updateTrack(index, updatedTrack);
        };
    };

    const urlKeyHandler = (index: number) => {
        return (event: React.KeyboardEvent<HTMLDivElement>) => {
            // only process for (CMD | CTRL) + g
            if (!event.metaKey && !event.ctrlKey) {
                return;
            }

            if (event.key !== "g" && event.key !== "G") {
                return;
            }

            const track = trackList.tracks[index];
            const possiblyGoogleDriveViewLink: string = track.url;
            const result: string | null = convertViewLinkToExportLink(
                possiblyGoogleDriveViewLink
            );
            if (result === null) {
                return;
            }

            const updatedTrack: Track = { ...track, url: result };
            updateTrack(index, updatedTrack);

            event.preventDefault();
        };
    };

    const updateTrack = (index: number, track: Track) => {
        const clone = cloneTrackList();
        clone.tracks.splice(index, 1, track);
        setTrackList(clone);
    };

    const trackListInputs = (() => {
        const rows: React.ReactElement[] = trackList.tracks.map(
            (track: Track, index: number) => {
                // about version-index:
                // we don't want to rerender the textboxes every time because it interrupts the
                // typing experience by blurring focus while the user types
                //
                // but also we want to rerender the boxes every time the list is updated
                // i.e. tracks are added or removed
                // because the mapping of the track indices to the boxes may have changed
                //
                // version helps with this mostly because the track indices stably identify a track
                // for the same version
                return (
                    <>
                        <RowContainer key={`${version}-${index}`}>
                            <TextField
                                label="Track Label"
                                variant="outlined"
                                value={track.label}
                                onChange={labelChangeHandler(index)}
                                {...validateValue(track.label)}
                            />
                            <TextField
                                label="Track URL"
                                variant="outlined"
                                value={track.url}
                                onChange={urlChangeHandler(index)}
                                onKeyDown={urlKeyHandler(index)}
                                {...validateValue(track.url)}
                            />
                            <Button onClick={() => removeTrack(index)}>
                                <DeleteIcon />
                            </Button>
                        </RowContainer>

                        <Divider />
                    </>
                );
            }
        );

        rows.push(
            <InlineBlockBox>
                <AddNewRowBox key="append-action" onClick={() => appendTrack()}>
                    <Button>
                        <AddIcon />
                    </Button>
                    <Typography>Add a new track</Typography>
                </AddNewRowBox>
            </InlineBlockBox>
        );

        return rows;
    })();

    const handleSubmit = () => {
        if (hasError) {
            return;
        }

        props.onSubmit?.(trackList);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth={false}>
            <DialogTitle>Edit Track List</DialogTitle>
            <DialogContent>
                <Typography variant="body2" variantMapping={{ body2: "div" }}>
                    <Box>Add URLs for the audio track this song.</Box>
                    <Box>
                        This can be your own hosted files, or Youtube, etc.
                    </Box>
                </Typography>
                <Typography variant="body2" variantMapping={{ body2: "div" }}>
                    <Box>
                        This player works best if every track is a version of
                        the same song,
                    </Box>
                    <Box>
                        e.g. the original recording, just the accompaniment,
                        only drums + bass.
                    </Box>
                </Typography>
                <Divider />
                {trackListInputs}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button disabled={hasError} onClick={handleSubmit}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrackListEditDialog;
