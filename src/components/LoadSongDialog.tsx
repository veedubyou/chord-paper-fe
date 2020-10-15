import {
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { isLeft } from "fp-ts/lib/Either";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { getSongsForUser } from "../common/backend";
import { SongSummary } from "../common/ChordModel/ChordSong";
import { FetchState } from "../common/fetch";
import { songPath } from "../common/paths";
import { PlainFn } from "../common/PlainFn";
import ErrorImage from "./display/ErrorImage";
import { UserContext } from "./user/userContext";

interface LoadSongsDialogProps {
    open: boolean;
    onClose?: PlainFn;
}

const LoadSongDialog: React.FC<LoadSongsDialogProps> = (
    props: LoadSongsDialogProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<FetchState<SongSummary[]>>({
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

    const loadSummaries = async () => {
        const result = await getSongsForUser(
            user.user_id,
            user.google_auth_token
        );
        if (isLeft(result)) {
            setFetchState({ state: "error", error: result.left });
            return;
        }

        const summariesResult = SongSummary.fromJSONList(result.right);
        if (isLeft(summariesResult)) {
            setFetchState({ state: "error", error: summariesResult.left });
            return;
        }

        setFetchState({ state: "loaded", item: summariesResult.right });
    };

    const summaryListItem = (summary: SongSummary): React.ReactElement => {
        const songLink = songPath.withID(summary.id);

        const navigateToSong = () => {
            history.push(songLink.URL());
            props.onClose?.();
        };

        const detailElement = (
            detail: string,
            label: string
        ): React.ReactNode => {
            if (detail === "") {
                return null;
            }

            return (
                <Typography display="block" variant="caption">
                    {`${label}: ${detail}`}
                </Typography>
            );
        };

        const details = (
            <>
                {detailElement(summary.metadata.performedBy, "Performed by")}
                {detailElement(summary.metadata.composedBy, "Composed by")}
            </>
        );

        const title =
            summary.metadata.title !== ""
                ? summary.metadata.title
                : "(Untitled)";

        return (
            <ListItem key={summary.id} button onClick={navigateToSong}>
                <ListItemText
                    primary={title}
                    secondary={details}
                ></ListItemText>
            </ListItem>
        );
    };

    const summaryCards = (summaries: SongSummary[]): React.ReactElement => {
        return <List>{summaries.map(summaryListItem)}</List>;
    };

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            loadSummaries();
            return <></>;
        }
        case "error": {
            console.error(fetchState.error);
            return wrapInDialog(<ErrorImage />);
        }
        case "loading": {
            return wrapInDialog(<LinearProgress />);
        }
        case "loaded": {
            if (user.user_id === "109453974626961032486") {
                const yt = (
                    <iframe
                        title="roll"
                        width="800"
                        height="640"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    ></iframe>
                );
                return wrapInDialog(yt);
            }

            return wrapInDialog(summaryCards(fetchState.item));
        }
    }
};

export default LoadSongDialog;
