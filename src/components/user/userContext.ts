import React from "react";

interface LoginResponse {
    id: string;
    name: string | null;
}

export class User {
    private googleUser: gapi.auth2.CurrentUser;
    name: string | null;
    userID: string;
    authToken: string;

    constructor(
        googleUser: gapi.auth2.CurrentUser,
        userID: string,
        name: string | null
    ) {
        this.googleUser = googleUser;
        this.userID = userID;
        this.name = name;

        this.authToken = googleUser.get().getAuthResponse().id_token;
        console.log("original auth token");
        console.log(this.authToken);

        this.googleUser.listen(() => {
            this.refreshAuthToken.call(this);
        });
    }

    private refreshAuthToken() {
        this.authToken = this.getNewAuthToken();
        console.log("getting new auth token");
        console.log(new Date());
        console.log(this.authToken);
    }

    private getNewAuthToken(): string {
        const user = this.googleUser.get();
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
