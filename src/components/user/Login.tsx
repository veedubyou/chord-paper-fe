import React, { useEffect, useState } from "react";
import ky from "ky/umd";
import {
    Typography as UnstyledTypography,
    Box as UnstyledBox,
    StyledComponentProps,
    Paper as UnstyledPaper,
    Grid,
    Theme,
} from "@material-ui/core";
import SigninIcon from "../../assets/img/google_signin.png";

import { useSnackbar } from "notistack";
import { withStyles, makeStyles } from "@material-ui/styles";

const Paper = withStyles({
    root: {
        width: "100%",
    },
})(UnstyledPaper);

const Box = withStyles({
    root: {
        width: "100%",
    },
})(UnstyledBox);

const Typography = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
    },
}))(UnstyledTypography);

const googleSignInID = "google-sign-in";
const googleClientID =
    "650853277550-ta69qbfcvdl6tb5ogtnh2d07ae9rcdlf.apps.googleusercontent.com";

const backendHost = ((): string => {
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

const useSigninStyles = makeStyles({
    root: {
        maxWidth: "100%",
        maxHeight: "100%",
        cursor: "pointer",
    },
});

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

type UserInfoState = User | null;

interface LoginProps extends StyledComponentProps {}

const Login: React.FC<LoginProps> = (props: LoginProps): JSX.Element => {
    const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfoState>(null);
    const { enqueueSnackbar } = useSnackbar();
    const signinStyles = useSigninStyles();

    const shouldShowSigninButton = (
        userInfo: UserInfoState
    ): userInfo is null => {
        return userInfo === null;
    };

    useEffect(() => {
        if (gapiLoaded) {
            return;
        }

        if (window["gapi"] !== undefined) {
            setGapiLoaded(true);
        } else {
            enqueueSnackbar("gapi is not loaded, working offline only", {
                variant: "error",
            });
        }
    }, [gapiLoaded, enqueueSnackbar]);

    useEffect(() => {
        if (!gapiLoaded) {
            return;
        }

        gapi.load("auth2", () => {
            const handleGoogleLogin = async (user: gapi.auth2.GoogleUser) => {
                const idToken: string = user.getAuthResponse().id_token;
                const userID: string = user.getId();

                let parsed: unknown;

                try {
                    parsed = await ky
                        .post(backendHost + "/login/" + userID, {
                            headers: {
                                Authorization: "Bearer " + idToken,
                            },
                        })
                        .json();
                } catch (e) {
                    console.error("Failed to make login request to BE", e);
                    enqueueSnackbar(
                        "Failed to login to backend. Check console for more error details",
                        { variant: "error" }
                    );

                    return;
                }

                if (!validateAsUser(parsed)) {
                    console.error("JSON payload is not a user", parsed);
                    enqueueSnackbar(
                        "Failed to login to backend. Check console for more error details",
                        { variant: "error" }
                    );

                    return;
                }

                setUserInfo(parsed);
            };

            if (!shouldShowSigninButton(userInfo)) {
                return;
            }

            const handleAuthInit = (authClient: gapi.auth2.GoogleAuth) => {
                authClient.attachClickHandler(
                    document.getElementById(googleSignInID),
                    {},
                    handleGoogleLogin,
                    (failureReason: string) => {
                        console.error(
                            "Failed to login to Google",
                            failureReason
                        );
                    }
                );

                if (authClient.isSignedIn.get()) {
                    handleGoogleLogin(authClient.currentUser.get());
                }
            };

            gapi.auth2
                .init({
                    client_id: googleClientID,
                    scope: "profile email",
                })
                .then(handleAuthInit);
        });
    }, [enqueueSnackbar, userInfo, setUserInfo, gapiLoaded]);

    if (!gapiLoaded) {
        return <div></div>;
    }

    if (shouldShowSigninButton(userInfo)) {
        return (
            <Paper classes={props.classes}>
                <Box id={googleSignInID}>
                    <img
                        src={SigninIcon}
                        alt="Google Signin"
                        className={signinStyles.root}
                    />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper classes={props.classes}>
            <Grid container>
                <Grid item container justify="center">
                    <Typography>Signed in as {userInfo.name}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Login;
