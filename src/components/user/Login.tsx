import React, { useEffect, useState } from "react";
import ky from "ky";
import { Typography, Box, StyledComponentProps } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { withStyles } from "@material-ui/styles";

const googleSignInID = "google-sign-in";

const validateAsUser = (response: unknown): response is User => {
    if (typeof response !== "object") {
        return false;
    }

    if (response === null || response === undefined) {
        return false;
    }

    return "name" in response;
};

interface User {
    name: string | null;
}

interface UserInfo {
    type: "userinfo";
    user: User;
}

interface UserError {
    type: "error";
    error: Error;
}

type UserInfoState = UserInfo | UserError | null;

interface LoginProps extends StyledComponentProps {}

const Login: React.FC<LoginProps> = (props: LoginProps): JSX.Element => {
    const [userInfo, setUserInfo] = useState<UserInfoState>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const handleGoogleLogin = async (user: gapi.auth2.GoogleUser) => {
            const idToken: string = user.getAuthResponse().id_token;
            let parsed: unknown;

            try {
                parsed = await ky
                    .post("http://localhost:5000/login", {
                        json: { id_token: idToken },
                    })
                    .json();
            } catch (e) {
                console.error("Failed to make login request to BE", e);
                enqueueSnackbar(
                    "Failed to login to backend. Check console for more error details",
                    { variant: "error" }
                );
                setUserInfo({ type: "error", error: e });
                return;
            }

            if (!validateAsUser(parsed)) {
                console.error("JSON payload is not a user", parsed);
                enqueueSnackbar(
                    "Failed to login to backend. Check console for more error details",
                    { variant: "error" }
                );
                setUserInfo({
                    type: "error",
                    error: new Error("malformed json"),
                });

                return;
            }

            setUserInfo({ type: "userinfo", user: parsed });
        };

        if (userInfo === null) {
            gapi.signin2.render(googleSignInID, {
                scope: "profile email",
                width: 240,
                height: 50,
                longtitle: true,
                theme: "light",
                onsuccess: handleGoogleLogin,
            });
        }
    }, [userInfo, enqueueSnackbar]);

    if (userInfo === null) {
        return (
            <Box className={props.classes?.root}>
                <div id={googleSignInID} />
            </Box>
        );
    }

    if (userInfo.type === "error") {
        return (
            <Box className={props.classes?.root}>
                <Typography>
                    An error has occurred when signing in, please refresh.
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={props.classes?.root}>
            <Typography>{userInfo.user.name}</Typography>
        </Box>
    );
};

export default Login;
