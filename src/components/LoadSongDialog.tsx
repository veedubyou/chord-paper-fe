import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import { RequestError } from "common/backend/errors";
import { getSongsForUser } from "common/backend/requests";
import { SongSummary } from "common/ChordModel/ChordSong";
import { FetchState } from "common/fetch";
import { SongPath } from "common/paths";
import { PlainFn } from "common/PlainFn";
import OneTimeErrorNotification from "components/display/OneTimeErrorNotification";
import { UserContext } from "components/user/userContext";
import { isLeft, left } from "fp-ts/lib/Either";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface LoadSongsDialogProps {
    open: boolean;
    onClose?: PlainFn;
}

const LoadSongDialog: React.FC<LoadSongsDialogProps> = (
    props: LoadSongsDialogProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<
        FetchState<SongSummary[], RequestError>
    >({
        state: "not-started",
    });
    const user = React.useContext(UserContext);
    const history = useHistory();

    const wrapInDialog = (contents: React.ReactNode): React.ReactElement => {
        return (
            <Dialog open={props.open} onClose={props.onClose} fullWidth>
                <DialogTitle>Load Songs</DialogTitle>
                <DialogContent>{contents}</DialogContent>
            </Dialog>
        );
    };

    if (user === null) {
        return wrapInDialog(
            <Typography>
                You must be logged in to load a song graahhhhh *foams at mouth*
            </Typography>
        );
    }

    const summarySortFn = (a: SongSummary, b: SongSummary): number => {
        if (a.lastSavedAt === b.lastSavedAt) {
            return 0;
        }

        // sort in reverse order - most recently saved should come first
        if (a.lastSavedAt === null) {
            return 1;
        }

        if (b.lastSavedAt === null) {
            return -1;
        }

        return a.lastSavedAt < b.lastSavedAt ? 1 : -1;
    };

    const loadSummaries = async () => {
        const result = await getSongsForUser(user.userID, user.authToken);
        if (isLeft(result)) {
            setFetchState({ state: "error", error: result.left });
            return;
        }

        const summariesResult = SongSummary.fromJSONList(result.right);
        if (isLeft(summariesResult)) {
            setFetchState({
                state: "error",
                error: left(summariesResult.left.message),
            });
            return;
        }

        const summaries = summariesResult.right;
        summaries.sort(summarySortFn);

        setFetchState({ state: "loaded", item: summaries });
    };

    const summaryListItem = (summary: SongSummary): React.ReactElement => {
        const songLink = SongPath.root.withID(summary.id);

        const navigateToSong = () => {
            history.push(songLink.URL());
            props.onClose?.();
        };

        const detailElement = (
            detail: string | undefined,
            label: string
        ): React.ReactNode => {
            if (detail === "" || detail === undefined) {
                return null;
            }

            return (
                <Typography
                    key={`${summary.id}-${label}`}
                    display="block"
                    variant="caption"
                >
                    {`${label}: ${detail}`}
                </Typography>
            );
        };

        const details = (
            <>
                {detailElement(summary.metadata.currentKey, "In the key of")}
                {detailElement(summary.metadata.performedBy, "Performed by")}
                {detailElement(summary.metadata.composedBy, "Composed by")}
                {summary.lastSavedAt !== null && (
                    <Typography
                        key={`${summary.id}-lastSavedAt`}
                        display="block"
                        variant="caption"
                    >
                        {`Last Saved At: ${summary.lastSavedAt.toLocaleString()}`}
                    </Typography>
                )}
            </>
        );

        const title =
            summary.metadata.title !== ""
                ? summary.metadata.title
                : "(Untitled)";

        return (
            <React.Fragment key={summary.id}>
                <ListItem key={summary.id} button onClick={navigateToSong}>
                    <ListItemText
                        primary={title}
                        primaryTypographyProps={{
                            key: `${summary.id}-primary`,
                        }}
                        secondary={details}
                        secondaryTypographyProps={{
                            key: `${summary.id}-seccondary`,
                        }}
                    />
                </ListItem>
                <Divider key={`${summary.id}-divider`} />
            </React.Fragment>
        );
    };

    const summaryCards = (summaries: SongSummary[]): React.ReactElement => {
        if (summaries.length === 0) {
            return (
                <Typography>
                    You don't have any songs saved. GET TO IT
                </Typography>
            );
        }

        return <List>{summaries.map(summaryListItem)}</List>;
    };

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            loadSummaries();
            return <></>;
        }
        case "error": {
            const resetState = () => setFetchState({ state: "not-started" });
            return (
                <OneTimeErrorNotification
                    componentDescription="Load Song Dialog"
                    error={fetchState.error}
                    onClose={resetState}
                />
            );
        }
        case "loading": {
            return wrapInDialog(<LinearProgress />);
        }
        case "loaded": {
            return wrapInDialog(summaryCards(fetchState.item));
        }
    }
};

export default LoadSongDialog;
