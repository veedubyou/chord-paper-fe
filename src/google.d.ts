declare global {
    interface Window {
        google: typeof import("google.accounts");
    }
}
export {};

