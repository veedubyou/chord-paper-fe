import React from "react";

interface LoginResponse {
    id: string;
    name: string | null;
}

export class User {
    private currentGoogleUser: gapi.auth2.CurrentUser;
    name: string | null;
    userID: string;
    authToken: string;

    constructor(
        currentGoogleUser: gapi.auth2.CurrentUser,
        userID: string,
        name: string | null
    ) {
        this.currentGoogleUser = currentGoogleUser;
        this.userID = userID;
        this.name = name;

        const googleUser: gapi.auth2.GoogleUser = currentGoogleUser.get();

        this.authToken = googleUser.getAuthResponse().id_token;

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

export const UserContext = React.createContext<User | null>(null);

export const deserializeUser = (
    response: unknown,
    googleUser: gapi.auth2.CurrentUser
): User | null => {
    if (!validateResponse(response)) {
        return null;
    }

    return new User(googleUser, response.id, response.name);
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
