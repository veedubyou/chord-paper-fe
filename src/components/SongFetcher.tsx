import { getSong } from "common/backend/requests";
import { ChordSong } from "common/ChordModel/ChordSong";
import { FetchState } from "common/fetch";
import ErrorImage from "components/display/ErrorImage";
import FullScreenLoading from "components/loading/FullScreenLoading";
import { isLeft } from "fp-ts/lib/These";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface IDParams {
    id: string;
}

interface InternalFetcherProps {
    id: string;
    children: (song: ChordSong) => JSX.Element;
}

const InternalFetcher: React.FC<InternalFetcherProps> = (
    props: InternalFetcherProps
): JSX.Element => {
    const [fetchState, setFetchState] = useState<FetchState<ChordSong>>({
        state: "not-started",
    });

    const fetchSong = async () => {
        let fetchResult = await getSong(props.id);

        if (isLeft(fetchResult)) {
            setFetchState({ state: "error", error: fetchResult.left });
            return;
        }

        const result = ChordSong.fromJSONObject(fetchResult.right);
        if (isLeft(result)) {
            setFetchState({
                state: "error",
                error: "Failed to deserialize payload to song",
            });
            return;
        }

        setFetchState({ state: "loaded", item: result.right });
    };

    switch (fetchState.state) {
        case "not-started": {
            setFetchState({ state: "loading" });
            fetchSong();
            return <></>;
        }
        case "error": {
            return <ErrorImage error={fetchState.error} />;
        }

        case "loading": {
            return <FullScreenLoading />;
        }

        case "loaded": {
            return props.children(fetchState.item);
        }
    }
};

interface SongFetcherProps {
    children: (song: ChordSong) => JSX.Element;
}

const SongFetcher: React.FC<SongFetcherProps> = (
    props: SongFetcherProps
): JSX.Element => {
    const { id } = useParams<IDParams>();

    // setting a key to force React to discard the component when the ID changes
    // so that it does not reuse old fetch state
    return (
        <InternalFetcher key={id} id={id}>
            {props.children}
        </InternalFetcher>
    );
};

export default SongFetcher;
