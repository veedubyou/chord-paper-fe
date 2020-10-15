import CircularProgress from "@material-ui/core/CircularProgress";
import { isLeft } from "fp-ts/lib/These";
import ky from "ky";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { backendHost } from "../common/backend";
import { ChordSong } from "../common/ChordModel/ChordSong";
import ErrorImage from "../assets/img/error.jpeg";
import { makeStyles } from "@material-ui/styles";

interface IDParams {
    id: string;
}

interface NotStartedState {
    state: "not-started";
}

interface ErrorState {
    state: "error";
    error: unknown;
}

interface LoadingState {
    state: "loading";
}

interface LoadedState {
    state: "loaded";
    song: ChordSong;
}

type FetchState = NotStartedState | ErrorState | LoadingState | LoadedState;

const useErrorStyles = makeStyles({
    root: {
        objectFit: "contain",
    },
});

interface SongFetcherProps {
    children: (song: ChordSong) => JSX.Element;
}

const SongFetcher: React.FC<SongFetcherProps> = (
    props: SongFetcherProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<FetchState>({
        state: "not-started",
    });
    const { id } = useParams<IDParams>();
    const errorStyles = useErrorStyles();

    const fetchSong = async () => {
        let parsed: unknown;

        try {
            parsed = await ky.get(backendHost + "/songs/" + id).json();
        } catch (e) {
            setFetchState({ state: "error", error: e });
            return;
        }

        const result = ChordSong.fromJSONObject(parsed);
        if (isLeft(result)) {
            setFetchState({
                state: "error",
                error: "Failed to deserialize payload to song",
            });
            return;
        }

        setFetchState({ state: "loaded", song: result.right });
    };

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            fetchSong();
            return <></>;
        }
        case "error": {
            console.error(fetchState.error);
            return (
                <img
                    src={ErrorImage}
                    className={errorStyles.root}
                    alt="Song Loading Error"
                />
            );
        }
        case "loading": {
            return <CircularProgress size={200} thickness={1} />;
        }
        case "loaded": {
            return props.children(fetchState.song);
        }
    }
};

export default SongFetcher;
