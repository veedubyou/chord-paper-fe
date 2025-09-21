import {
    Alert,
    AlertTitle,
    Box,
    Dialog,
    Grid,
    Link as MaterialLink,
    Paper as UnstyledPaper,
    styled,
    Typography as UnstyledTypography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import SigninIcon from "assets/img/google_signin.svg";
import { BackendError, RequestError } from "common/backend/errors";
import { login } from "common/backend/requests";
import { getRouteForTutorialComponent } from "components/Tutorial";
import LoginTutorial from "components/tutorial/Login";
import {
    deserializeUser,
    User,
    UserContext,
} from "components/user/userContext";
import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Paper = styled(UnstyledPaper)({
    width: "100%",
    cursor: "pointer",
});

const Typography = styled(UnstyledTypography)(({ theme }) => ({
    margin: theme.spacing(2),
    color: grey[600],
}));

const Paragraph = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const googleSignInID = "google-sign-in";
const googleClientID =
    "650853277550-ta69qbfcvdl6tb5ogtnh2d07ae9rcdlf.apps.googleusercontent.com";

interface LoginProps {
    onUserChanged: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = (props: LoginProps): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();

    const [gapiLoaded, setGapiLoaded] = useState<boolean>(false);
    const [dialogError, setDialogError] = useState<BackendError | null>(null);
    const [snackbarError, setSnackbarError] = useState<RequestError | null>(
        null
    );
    const user: User | null = React.useContext(UserContext);

    const userNotSignedIn = (user: User | null): user is null => {
        return user === null;
    };

    const shouldDisplayDialog = (
        reqError: RequestError
    ): BackendError | null => {
        if (reqError === null) {
            return null;
        }

        if (isLeft(reqError)) {
            return null;
        }

        const backendError = reqError.right;
        if (
            !(
                backendError.code === "no_account" ||
                backendError.code === "failed_google_verification"
            )
        ) {
            return null;
        }

        return backendError;
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
        if (snackbarError === null) {
            return;
        }

        if (isLeft(snackbarError)) {
            console.error(snackbarError.left);

            enqueueSnackbar(
                "Login failed for an unknown reason, please check console for more details",
                { variant: "error" }
            );
        } else {
            enqueueSnackbar(`Login failed: ${snackbarError.right.msg}`, {
                variant: "error",
            });
        }

        setSnackbarError(null);
    }, [enqueueSnackbar, snackbarError, setSnackbarError]);

    useEffect(() => {
        if (!gapiLoaded) {
            return;
        }

        gapi.load("auth2", () => {
            const handleLoginError = (
                loginError: RequestError,
                authClient: gapi.auth2.GoogleAuth
            ): void => {
                const dialogError = shouldDisplayDialog(loginError);
                if (dialogError !== null) {
                    setDialogError(dialogError);
                } else {
                    setSnackbarError(loginError);
                }

                props.onUserChanged(null);
                authClient.signOut();
            };

            const handleGoogleLogin = async (
                currentUser: gapi.auth2.CurrentUser,
                authClient: gapi.auth2.GoogleAuth
            ) => {
                const idToken: string = currentUser
                    .get()
                    .getAuthResponse().id_token;

                let loginResult = await login(idToken);

                if (isLeft(loginResult)) {
                    handleLoginError(loginResult.left, authClient);
                    return;
                }

                const parsedUser = deserializeUser(
                    loginResult.right,
                    currentUser
                );

                if (parsedUser === null) {
                    console.error(
                        "JSON payload is not a user",
                        loginResult.right
                    );
                    enqueueSnackbar(
                        "Failed to login to backend. Check console for more error details",
                        { variant: "error" }
                    );

                    return;
                }

                props.onUserChanged(parsedUser);
            };

            if (!userNotSignedIn(user)) {
                return;
            }

            const handleAuthInit = (authClient: gapi.auth2.GoogleAuth) => {
                authClient.attachClickHandler(
                    document.getElementById(googleSignInID),
                    {},
                    () => handleGoogleLogin(authClient.currentUser, authClient),
                    (failureReason: string) => {
                        console.error(
                            "Failed to login to Google",
                            failureReason
                        );
                    }
                );

                if (authClient.isSignedIn.get()) {
                    handleGoogleLogin(authClient.currentUser, authClient);
                }
            };

            gapi.auth2
                .init({
                    client_id: googleClientID,
                    scope: "profile email",
                })
                .then(handleAuthInit);
        });
    }, [
        enqueueSnackbar,
        user,
        props,
        gapiLoaded,
        setDialogError,
        setSnackbarError,
    ]);

    if (!gapiLoaded) {
        return <div></div>;
    }

    const userDescription: string = ((): string => {
        if (userNotSignedIn(user)) {
            return "Sign In";
        }

        if (user.name === null) {
            return "You Logged In But Who Are You???";
        }

        return user.name;
    })();

    const errorDialog: React.ReactElement = (() => {
        const content: React.ReactElement | null = (() => {
            if (dialogError === null) {
                return null;
            }

            switch (dialogError.code) {
                case "no_account":
                    const loginTutorialRoute =
                        getRouteForTutorialComponent(LoginTutorial);

                    const signupLink = (
                        <MaterialLink
                            href="https://forms.gle/4kgLF6oXPfFYDTm86"
                            target="_blank"
                            rel="noopener"
                        >
                            here
                        </MaterialLink>
                    );

                    return (
                        <Alert severity="info">
                            <AlertTitle>No account found</AlertTitle>
                            <Paragraph>
                                Thanks for stopping by! Looks like there is no
                                Chord Paper account associated with your Google
                                account.
                            </Paragraph>
                            <Paragraph>
                                You can still use the offline functionalities
                                for now. You won't be able to save any songs
                                that you write right now. See more details{" "}
                                <Link to={loginTutorialRoute}>here</Link>.
                            </Paragraph>
                            <Paragraph>
                                In addition to being able to save your song, you
                                will also be able to use the audio player with
                                an account (check out how that works in the
                                Demo, accessible on the left hand menu)
                            </Paragraph>
                            <Paragraph>
                                To request an account, please fill out the form{" "}
                                {signupLink}. I will try to get back to you
                                soon!
                            </Paragraph>
                        </Alert>
                    );
                case "failed_google_verification":
                    return (
                        <Alert severity="error">
                            <AlertTitle>
                                Google account verification failed
                            </AlertTitle>
                            <Paragraph>
                                Your Google account failed server verification.
                            </Paragraph>
                            <Paragraph>
                                Please try to refresh and login to your Google
                                account again.
                            </Paragraph>
                        </Alert>
                    );
                default:
                    return null;
            }
        })();

        const clearDialogError = () => setDialogError(null);

        return (
            <Dialog open={content !== null} onClose={clearDialogError}>
                {content}
            </Dialog>
        );
    })();

    return (
        <Paper id={googleSignInID}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <img
                        src={SigninIcon}
                        alt="Google Signin"
                        style={{
                            display: "inline-block",
                            objectFit: "contain",
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="h6" display="inline">
                        {userDescription}
                    </Typography>
                </Grid>
            </Grid>
            {errorDialog}
        </Paper>
    );
};

export default Login;
