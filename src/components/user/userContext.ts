import React from "react";
import { noopFn } from "../../common/PlainFn";

interface LoginResponse {
    id: string;
    name: string | null;
}

export class User {
    private currentGoogleUser: gapi.auth2.CurrentUser;
    name: string;
    userID: string;
    authToken: string;

    constructor(currentGoogleUser: gapi.auth2.CurrentUser, userID: string) {
        this.currentGoogleUser = currentGoogleUser;
        this.userID = userID;

        const googleUser: gapi.auth2.GoogleUser = currentGoogleUser.get();

        this.authToken = googleUser.getAuthResponse().id_token;
        this.name = googleUser.getBasicProfile().getName();

        this.currentGoogleUser.listen(() => {
            this.refreshAuthToken.call(this);
        });
    }

    private refreshAuthToken() {
        this.authToken = this.getNewAuthToken();
    }

    private getNewAuthToken(): string {
        const user = this.currentGoogleUser.get();
        return user.getAuthResponse().id_token;
    }
}

export type SetUserFn = (user: User | null) => void;
export const UserContext = React.createContext<User | null>(null);
export const SetUserContext = React.createContext<SetUserFn>(noopFn);

export const deserializeUser = (
    response: unknown,
    googleUser: gapi.auth2.CurrentUser
): User | null => {
    if (!validateResponse(response)) {
        return null;
    }

    return new User(googleUser, response.id);
};

const validateResponse = (response: unknown): response is LoginResponse => {
    if (typeof response !== "object") {
        return false;
    }

    if (response === null || response === undefined) {
        return false;
    }

    return "id" in response && "name" in response;
};
