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

interface LoadedState<T> {
    state: "loaded";
    item: T;
}

export type FetchState<T> =
    | NotStartedState
    | ErrorState
    | LoadingState
    | LoadedState<T>;
