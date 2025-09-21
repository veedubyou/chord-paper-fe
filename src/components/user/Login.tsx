import {
    Alert,
    AlertTitle,
    Box,
    Dialog,
    Grid,
    Link as MaterialLink,
    Paper as UnstyledPaper,
    styled,
} from "@mui/material";
import { BackendError, RequestError } from "common/backend/errors";
import { login } from "common/backend/requests";
import { getRouteForTutorialComponent } from "components/Tutorial";
import LoginTutorial from "components/tutorial/Login";
import { deserializeUser, User } from "components/user/userContext";
import { isLeft } from "fp-ts/lib/These";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Paper = styled(UnstyledPaper)({
    width: "100%",
    cursor: "pointer",
});

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
    // const user: User | null = React.useContext(UserContext);

    // const userNotSignedIn = (user: User | null): user is null => {
    //     return user === null;
    // };

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
        if (!window.google) {
            enqueueSnackbar(
                "Google Identity Services (gis) not loaded, working offline only",
                {
                    variant: "error",
                }
            );
            return;
        }

        const handleCredentialResponse = async (response: any) => {
            console.log(response);
            const idToken: string | undefined = response?.credential;
            if (!idToken) {
                console.error("No credential in GIS response", response);
                enqueueSnackbar("Google login failed (no token received)", {
                    variant: "error",
                });
                return;
            }

            const loginResult = await login(idToken);

            if (isLeft(loginResult)) {
                const reqErr = loginResult.left;
                const dialogErr = shouldDisplayDialog(reqErr);
                if (dialogErr !== null) {
                    setDialogError(dialogErr);
                } else {
                    setSnackbarError(reqErr);
                }

                // simulate a log out here for failure
                window.google?.accounts?.id?.disableAutoSelect?.();
                props.onUserChanged(null);
                return;
            }

            const parsedUser = deserializeUser(loginResult.right, idToken);

            if (parsedUser === null) {
                console.error("JSON payload is not a user", loginResult.right);
                enqueueSnackbar(
                    "Failed to login to backend. Check console for more error details",
                    {
                        variant: "error",
                    }
                );
                return;
            }

            props.onUserChanged(parsedUser);
        };

        window.google.accounts.id.initialize({
            client_id: googleClientID,
            callback: handleCredentialResponse,
        });

        // render the button into an element with id "google-sign-in-button"
        const container = document.getElementById(googleSignInID);
        if (container === null) {
            return;
        }

        window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            type: "standard",
        });
    }, [enqueueSnackbar, props]); // add other deps if needed

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
        <Paper>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <div
                        id={googleSignInID}
                        style={{
                            // marginTop: 8,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    />
                </Grid>
            </Grid>

            {errorDialog}
        </Paper>
    );
};

export default Login;
