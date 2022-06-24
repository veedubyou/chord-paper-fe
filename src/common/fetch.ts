interface NotStartedState {
    state: "not-started";
}

interface ErrorState<E> {
    state: "error";
    error: E;
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

export type BasicFetchState<T, E> =
    | NotStartedState
    | ErrorState<E>
    | LoadingState
    | LoadedState<T>;

export type DetailedLoadingFetchState<T, E, U> =
    | NotStartedState
    | ErrorState<E>
    | DetailedLoadingState<U>
    | LoadedState<T>;

export type FetchState<T, E, U = undefined> = U extends undefined
    ? BasicFetchState<T, E>
    : DetailedLoadingFetchState<T, E, U>;
