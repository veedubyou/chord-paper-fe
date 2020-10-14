export const backendHost = ((): string => {
    const localURL = "http://localhost:5000";

    if (
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
    ) {
        return localURL;
    }

    const backendURL: string | undefined = process.env.REACT_APP_BACKEND_URL;
    if (backendURL === undefined) {
        console.error("Production build doesn't have backend URL set!");
        return localURL;
    }

    return backendURL;
})();
