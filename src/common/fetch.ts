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

interface DetailedLoadingState<T> extends LoadingState {
    details: T;
}

interface LoadedState<T> {
    state: "loaded";
    item: T;
}

type BasicFetchState<T> =
    | NotStartedState
    | ErrorState
    | LoadingState
    | LoadedState<T>;

type DetailedLoadingFetchState<T, U> =
    | NotStartedState
    | ErrorState
    | DetailedLoadingState<U>
    | LoadedState<T>;

export type FetchState<T, U = undefined> = U extends undefined
    ? BasicFetchState<T>
    : DetailedLoadingFetchState<T, U>;
