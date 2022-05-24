import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    Box as UnstyledBox,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Menu,
    MenuItem,
    styled,
    Typography as UnstyledTypography
} from "@mui/material";
import lodash from "lodash";
import React, { useState } from "react";
import { SingleTrack } from "../../../common/ChordModel/tracks/SingleTrack";
import {
    SplitStemTrack,
    SplitStemTypes
} from "../../../common/ChordModel/tracks/SplitStemRequest";
import {
    FiveStemKeys,
    FiveStemTrack,
    FourStemKeys,
    FourStemTrack,
    TwoStemKeys,
    TwoStemTrack
} from "../../../common/ChordModel/tracks/StemTrack";
import { Track } from "../../../common/ChordModel/tracks/Track";
import { TrackList } from "../../../common/ChordModel/tracks/TrackList";
import { PlainFn } from "../../../common/PlainFn";
import { TrackListLoad } from "../providers/TrackListProvider";
import SingleTrackRow from "./SingleTrackRow";
import SplitStemTrackRow from "./SplitStemTrackRow";
import StemTrackRow, { URLFieldLabel } from "./StemTrackRow";

interface TrackListEditDialogProps {
    open: boolean;
    onClose?: PlainFn;
    trackListLoad: TrackListLoad;
    onSubmit?: (trackList: TrackList) => void;
    onRefresh?: PlainFn;
}

const FlexBox = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(5),
    alignItems: "center",
    justifyItems: "center",
}));

const InlineBlockBox = styled(UnstyledBox)({
        display: "inline-block",
    });

const AddNewRowBox = styled(UnstyledBox)(({ theme }) => ({
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const Typography = styled(UnstyledTypography)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
}));

const TrackListEditDialog: React.FC<TrackListEditDialogProps> = (
    props: TrackListEditDialogProps
): JSX.Element => {
    const internalContent: JSX.Element = (() => {
        if (props.trackListLoad.state === "loading") {
            return (
                <FlexBox>
                    <CircularProgress size="15rem" />
                </FlexBox>
            );
        }

        return (
            <LoadedTrackListEditDialog
                trackList={props.trackListLoad.tracklist}
                onSubmit={props.onSubmit}
                onClose={props.onClose}
            />
        );
    })();

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth={false}>
            <DialogTitle>
                <Button onClick={props.onRefresh}>
                    <RefreshIcon />
                </Button>
                Edit Track List
            </DialogTitle>
            {internalContent}
        </Dialog>
    );
};

interface LoadedTrackListEditDialogProps {
    trackList: TrackList;
    onSubmit?: (trackList: TrackList) => void;
    onClose?: PlainFn;
}

const LoadedTrackListEditDialog: React.FC<LoadedTrackListEditDialogProps> = (
    props: LoadedTrackListEditDialogProps
): JSX.Element => {
    const emptySingleTrack = (): Track => {
        return new SingleTrack("", "", "");
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
    const [addTrackMenuElement, setAddTrackMenuElement] =
        useState<HTMLElement | null>(null);

    const bumpVersion = () => setVersion(version + 1);
    const cloneTrackList = () => lodash.cloneDeep(trackList);

    const handleAddTrackMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAddTrackMenuElement(event.currentTarget);
    };

    const handleCloseAddTrackMenu = () => {
        setAddTrackMenuElement(null);
    };

    const handleAddSingleTrack = () => {
        handleAddTrack(new SingleTrack("", "", ""));
    };

    const handleAddTwoStemTrack = () => {
        handleAddTrack(
            new TwoStemTrack("", "", { vocals: "", accompaniment: "" })
        );
    };

    const handleAddFourStemTrack = () => {
        handleAddTrack(
            new FourStemTrack("", "", {
                vocals: "",
                other: "",
                bass: "",
                drums: "",
            })
        );
    };

    const handleAddFiveStemTrack = () => {
        handleAddTrack(
            new FiveStemTrack("", "", {
                vocals: "",
                other: "",
                piano: "",
                bass: "",
                drums: "",
            })
        );
    };

    const handleAddSplitStemTrack = (splitType: SplitStemTypes) => {
        handleAddTrack(SplitStemTrack.newTrackRequest(splitType));
    };

    const handleAddTrack = (newTrack: Track) => {
        appendTrack(newTrack);
        handleCloseAddTrackMenu();
    };

    const appendTrack = (track: Track) => {
        const clone = cloneTrackList();
        clone.tracks.push(track);
        bumpVersion();
        setTrackList(clone);
    };

    const removeTrack = (index: number) => {
        const clone = cloneTrackList();
        clone.tracks.splice(index, 1);
        bumpVersion();
        setTrackList(clone);
    };

    const hasError: boolean = (() => {
        for (let track of trackList.tracks) {
            if (!track.validate()) {
                return true;
            }
        }

        return false;
    })();

    const updateTrack = (index: number, track: Track) => {
        const clone = cloneTrackList();
        clone.tracks.splice(index, 1, track);
        setTrackList(clone);
    };

    const trackChangeHandler = (index: number) => {
        return (newTrack: Track) => {
            updateTrack(index, newTrack);
        };
    };

    const trackListInputs = (() => {
        const rows: React.ReactElement[] = trackList.tracks.map(
            // linter is wrong here - switch at the bottom is exhaustive and the compiler can verify
            // it thinks that it may possibly return undefined, but it can't
            // eslint-disable-next-line array-callback-return
            (track: Track, index: number): React.ReactElement => {
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
                const rowKey = `${version}-${index}`;

                switch (track.track_type) {
                    case "single": {
                        return (
                            <SingleTrackRow
                                key={rowKey}
                                track={track}
                                onChange={trackChangeHandler(index)}
                                onRemove={() => removeTrack(index)}
                            />
                        );
                    }

                    case "2stems": {
                        const urlFieldLabels: URLFieldLabel<TwoStemKeys>[] = [
                            {
                                key: "vocals",
                                label: "Vocals File URL",
                            },
                            {
                                key: "accompaniment",
                                label: "Accompaniment File URL",
                            },
                        ];

                        return (
                            <StemTrackRow
                                key={rowKey}
                                track={track}
                                urlFieldLabels={urlFieldLabels}
                                onChange={trackChangeHandler(index)}
                                onRemove={() => removeTrack(index)}
                            />
                        );
                    }

                    case "4stems": {
                        const urlFieldLabels: URLFieldLabel<FourStemKeys>[] = [
                            {
                                key: "vocals",
                                label: "Vocals File URL",
                            },
                            {
                                key: "other",
                                label: "Other File URL",
                            },
                            {
                                key: "bass",
                                label: "Bass File URL",
                            },
                            {
                                key: "drums",
                                label: "Drums File URL",
                            },
                        ];

                        return (
                            <StemTrackRow
                                key={rowKey}
                                track={track}
                                urlFieldLabels={urlFieldLabels}
                                onChange={trackChangeHandler(index)}
                                onRemove={() => removeTrack(index)}
                            />
                        );
                    }

                    case "5stems": {
                        const urlFieldLabels: URLFieldLabel<FiveStemKeys>[] = [
                            {
                                key: "vocals",
                                label: "Vocals File URL",
                            },
                            {
                                key: "other",
                                label: "Other File URL",
                            },
                            {
                                key: "piano",
                                label: "Piano File URL",
                            },
                            {
                                key: "bass",
                                label: "Bass File URL",
                            },
                            {
                                key: "drums",
                                label: "Drums File URL",
                            },
                        ];

                        return (
                            <StemTrackRow
                                key={rowKey}
                                track={track}
                                urlFieldLabels={urlFieldLabels}
                                onChange={trackChangeHandler(index)}
                                onRemove={() => removeTrack(index)}
                            />
                        );
                    }

                    case "split_2stems":
                    case "split_4stems":
                    case "split_5stems": {
                        return (
                            <SplitStemTrackRow
                                key={rowKey}
                                track={track}
                                onChange={trackChangeHandler(index)}
                                onRemove={() => removeTrack(index)}
                            />
                        );
                    }
                }
            }
        );

        const showAddTrackMenu = addTrackMenuElement !== null;

        rows.push(
            <React.Fragment key="append">
                <InlineBlockBox>
                    <AddNewRowBox
                        key="append-action"
                        onClick={handleAddTrackMenu}
                    >
                        <AddIcon />
                        <Typography>Add a new track</Typography>
                    </AddNewRowBox>
                </InlineBlockBox>
                <Menu
                    open={showAddTrackMenu}
                    anchorEl={addTrackMenuElement}
                    onClose={handleCloseAddTrackMenu}
                >
                    <MenuItem onClick={handleAddSingleTrack}>
                        Single Track
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleAddSplitStemTrack("split_2stems")}
                    >
                        Split Track into 2 Stems
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleAddSplitStemTrack("split_4stems")}
                    >
                        Split Track into 4 Stems
                    </MenuItem>
                    <MenuItem
                        onClick={() => handleAddSplitStemTrack("split_5stems")}
                    >
                        Split Track into 5 Stems
                    </MenuItem>
                    <MenuItem onClick={handleAddTwoStemTrack}>
                        2 Stem Track
                    </MenuItem>
                    <MenuItem onClick={handleAddFourStemTrack}>
                        4 Stem Track
                    </MenuItem>
                    <MenuItem onClick={handleAddFiveStemTrack}>
                        5 Stem Track
                    </MenuItem>
                </Menu>
            </React.Fragment>
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
        <>
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
        </>
    );
};

export default TrackListEditDialog;
