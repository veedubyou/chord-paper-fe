import { noopFn } from "common/PlainFn";
import React from "react";

interface LoginResponse {
    id: string;
    name: string | null;
}

export class User {
    name: string;
    userID: string;
    authToken: string;

    constructor(userID: string, name: string, authToken: string) {
        this.userID = userID;

        this.authToken = authToken;
        this.name = name;
    }
}

export type SetUserFn = (user: User | null) => void;
export const UserContext = React.createContext<User | null>(null);
export const SetUserContext = React.createContext<SetUserFn>(noopFn);

export const deserializeUser = (
    response: unknown,
    authToken: string
): User | null => {
    if (!validateResponse(response)) {
        return null;
    }

    return new User(response.id, response.name ?? "Unknown Name", authToken);
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
