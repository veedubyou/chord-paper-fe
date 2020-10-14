import React from "react";

interface LoginResponse {
    id: string;
    name: string | null;
}

export interface User {
    name: string | null;
    user_id: string;
    google_auth_token: string;
}

export const UserContext = React.createContext<User | null>(null);

export const deserializeUser = (
    response: unknown,
    google_auth_token: string
): User | null => {
    if (!validateResponse(response)) {
        return null;
    }

    return {
        user_id: response.id,
        name: response.name,
        google_auth_token: google_auth_token,
    };
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
